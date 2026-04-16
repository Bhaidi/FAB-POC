"use client";

import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftFormData, IftInvoiceExtractedData } from "@/data/iftPaymentTypes";
import { currencyFlagMap, iftMockInvoiceExtraction } from "@/data/iftPaymentMock";

interface IftInvoiceUploadPanelProps {
  form: IftFormData;
  onChange: (patch: Partial<IftFormData>) => void;
}

type UploadState = "idle" | "processing" | "extracted";

export function IftInvoiceUploadPanel({ form, onChange }: IftInvoiceUploadPanelProps) {
  const { dashColors } = useFabTokens();
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const dropzoneHoverBg = useColorModeValue("gray.50", dashColors.surfaceHover);

  const [state, setState] = useState<UploadState>(
    form.invoiceExtractedData ? "extracted" : "idle",
  );

  const handleFileSelect = useCallback(() => {
    setState("processing");
    setTimeout(() => {
      onChange({
        uploadedFileName: "invoice_march2026.pdf",
        invoiceExtractedData: iftMockInvoiceExtraction,
      });
      setState("extracted");
    }, 1500);
  }, [onChange]);

  const handleApply = useCallback(() => {
    if (!form.invoiceExtractedData) return;
    const d = form.invoiceExtractedData;
    onChange({
      paymentAmount: d.paymentAmount,
      paymentCurrency: d.paymentCurrency,
      purposeOfPayment: "GDS",
      debitAccountId: "da-1",
      beneficiaryId: "ben-1",
      invoiceExtractedData: undefined,
      autoFillEnabled: false,
    });
    setState("idle");
  }, [form.invoiceExtractedData, onChange]);

  const handleCancel = useCallback(() => {
    onChange({
      autoFillEnabled: false,
      uploadedFileName: undefined,
      invoiceExtractedData: undefined,
    });
    setState("idle");
  }, [onChange]);

  const handleSwitchToManual = useCallback(() => {
    onChange({ autoFillEnabled: false });
    setState("idle");
  }, [onChange]);

  if (state === "extracted" && form.invoiceExtractedData) {
    return <ExtractedInfoCard data={form.invoiceExtractedData} onApply={handleApply} onCancel={handleCancel} />;
  }

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      w="full"
    >
      <Flex px={6} py={4} justify="space-between" align="center">
        <Text fontSize="md" fontWeight="medium" color={labelColor}>
          Auto-fill from Invoice
        </Text>
      </Flex>

      <Box px={6} pb={6}>
        {state === "processing" ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            gap={3}
          >
            <Spinner size="lg" color="accent.linkCta" />
            <Text fontSize="sm" color={hintColor}>
              Extracting invoice data…
            </Text>
          </Flex>
        ) : (
          <>
            <Box
              borderWidth="1px"
              borderStyle="dashed"
              borderColor={borderColor}
              borderRadius="lg"
              py={8}
              px={4}
              textAlign="center"
              cursor="pointer"
              _hover={{ bg: dropzoneHoverBg }}
              transition="background 0.15s"
              onClick={() => {
                document.getElementById("ift-invoice-upload")?.click();
              }}
            >
              <input
                id="ift-invoice-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.xlsx"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <Flex direction="column" align="center" gap={3}>
                <IconUpload size={24} color="gray" />
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color={labelColor}>
                    Choose a file or drag &amp; drop it here
                  </Text>
                  <Text fontSize="xs" color={hintColor} mt={1}>
                    JPEG, PNG, PDF, and XLSX formats, up to 10MB total size.
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box mt={4}>
              <Button
                variant="outline"
                size="sm"
                borderColor="accent.linkCta"
                color="accent.linkCta"
                borderRadius="md"
                fontWeight="medium"
                onClick={handleSwitchToManual}
              >
                Switch to manual
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

/* ── Extracted info sub-component ─────────────── */

function ExtractedInfoCard({
  data,
  onApply,
  onCancel,
}: {
  data: IftInvoiceExtractedData;
  onApply: () => void;
  onCancel: () => void;
}) {
  const { dashColors } = useFabTokens();
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const flag = currencyFlagMap[data.paymentCurrency] ?? "";

  const fields = [
    { label: "Beneficiary Name", value: data.beneficiaryName },
    { label: "Beneficiary Account Number", value: data.beneficiaryAccountNumber },
    { label: "Payment Amount", value: `${flag} ${data.paymentCurrency} ${data.paymentAmount}` },
    { label: "Beneficiary Bank Branch Name", value: data.beneficiaryBankBranch },
    { label: "Beneficiary Bank Country", value: data.beneficiaryBankCountry },
    { label: "Payment Purpose", value: data.paymentPurpose },
  ];

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      w="full"
    >
      <Text fontSize="md" fontWeight="medium" color={labelColor} mb={5}>
        Extracted Information
      </Text>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5} mb={6}>
        {fields.map((f) => (
          <Box key={f.label}>
            <Text fontSize="xs" color={hintColor}>
              {f.label}
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color={labelColor} mt={0.5}>
              {f.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Flex justify="center" gap={4}>
        <Button
          variant="outline"
          borderColor="accent.linkCta"
          color="accent.linkCta"
          borderRadius="md"
          fontWeight="medium"
          fontSize="sm"
          px={6}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          bg="accent.linkCta"
          color="white"
          borderRadius="md"
          fontWeight="medium"
          fontSize="sm"
          px={6}
          _hover={{ bg: "blue.600" }}
          onClick={onApply}
        >
          Apply to Form
        </Button>
      </Flex>
    </Box>
  );
}
