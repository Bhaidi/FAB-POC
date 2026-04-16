"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftFormData } from "@/data/iftPaymentTypes";

interface IftDocumentsAdviceSectionProps {
  form: IftFormData;
  onChange: (patch: Partial<IftFormData>) => void;
}

export function IftDocumentsAdviceSection({
  form,
  onChange,
}: IftDocumentsAdviceSectionProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const dropzoneHoverBg = useColorModeValue("gray.50", dashColors.surfaceHover);

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" p={5} w="full">
      <Flex direction="column" gap={4}>
        {/* Drag & drop zone */}
        <Box
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={borderColor}
          borderRadius="lg"
          py={6}
          px={4}
          textAlign="center"
          cursor="pointer"
          _hover={{ bg: dropzoneHoverBg }}
          transition="background 0.15s"
          onClick={() => {
            document.getElementById("ift-file-upload")?.click();
          }}
        >
          <input
            id="ift-file-upload"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.xlsx"
            style={{ display: "none" }}
          />
          <Flex direction="column" align="center" gap={4}>
            <IconUpload size={24} color="gray" />
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={labelColor}>
                Choose a file or drag &amp; drop it here
              </Text>
              <Text fontSize="xs" color={hintColor} mt={2}>
                Maximum 5 documents allowed. JPEG, PNG, PDF, and XLSX formats, up to 10MB total size.
              </Text>
            </Box>
            <Button
              variant="outline"
              size="sm"
              borderColor="accent.linkCta"
              color="accent.linkCta"
              borderRadius="sm"
              fontWeight="medium"
              _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
            >
              Browse File
            </Button>
          </Flex>
        </Box>

        {/* Send Advice */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Send Advice To Beneficiaries
          </FormLabel>
          <Input
            value={form.sendAdviceEmails}
            onChange={(e) => onChange({ sendAdviceEmails: e.target.value })}
            placeholder="Enter Email Addresses"
            bg={fieldBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
          <Text fontSize="xs" color={hintColor} mt={1}>
            Max. 5 email addresses are allowed. Use comma (,) for multiple email ID&apos;s.
          </Text>
        </FormControl>
      </Flex>
    </Box>
  );
}
