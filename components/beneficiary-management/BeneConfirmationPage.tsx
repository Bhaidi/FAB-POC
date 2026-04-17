"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useClipboard,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  IconChevronLeft,
  IconCircleCheck,
  IconCopy,
  IconDownload,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneEntities, beneCountries } from "@/data/beneficiaryMock";
import type { IftCountry } from "@/data/iftPaymentTypes";

interface BeneConfirmationPageProps {
  form: BeneficiaryFormData;
  onMakeAnother: () => void;
  onBackToDashboard: () => void;
}

/* ── Row ─────────────────────────────────────── */
function R({ l, v }: { l: string; v: string }) {
  const { dashColors } = useFabTokens();
  const lc = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const vc = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  return (
    <Flex py={1.5} justify="space-between" align="flex-start">
      <Text fontSize="xs" color={lc} flex="0 0 44%">{l}</Text>
      <Text fontSize="xs" fontWeight="semibold" color={vc} textAlign="right" wordBreak="break-all">{v || "—"}</Text>
    </Flex>
  );
}

export function BeneConfirmationPage({
  form,
  onMakeAnother,
  onBackToDashboard,
}: BeneConfirmationPageProps) {
  const { dashColors, dashGradients } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerBorderColor = useColorModeValue("#d7d7d7", dashColors.sectionDivider);
  const breadcrumbText = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const footerBg = useColorModeValue("white", "#060d24");
  const footerBorder = useColorModeValue("rgba(168,172,178,0.4)", dashColors.sectionDivider);
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const cardBorder = useColorModeValue("transparent", dashColors.cardBorder);
  const lc = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const divider = useColorModeValue("gray.200", dashColors.sectionDivider);

  const refNo = "BEN-2026-04170001";
  const { hasCopied, onCopy } = useClipboard(refNo);

  const country = beneCountries.find((c: IftCountry) => c.code === form.bankCountry);
  const entityNames =
    form.selectedEntities.length === beneEntities.length
      ? "All"
      : form.selectedEntities
          .map((id) => beneEntities.find((e) => e.id === id)?.cifName)
          .filter(Boolean)
          .join(", ");

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("transparent", dashColors.surfaceBase)} bgImage={useColorModeValue("none", dashGradients.canvas)}>
      {/* Header */}
      <Box
        bg={useColorModeValue("neutral.pageBg", "#060d24")}
        borderBottomWidth="1px"
        borderColor={headerBorderColor}
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="center" gap={3}>
          <Box as="button" p={2} cursor="pointer" color={labelColor} onClick={onBackToDashboard}>
            <IconChevronLeft size={16} />
          </Box>
          <Heading fontSize="xl" fontWeight="medium" color={breadcrumbText}>
            Beneficiary Added
          </Heading>
        </Flex>
      </Box>

      {/* Content — Split layout */}
      <Flex flex={1} mx="auto" maxW="1000px" w="full" mt={6} mb={10} gap={6} direction={{ base: "column", lg: "row" }} px={{ base: 4, md: 0 }}>
        {/* Left — Success Hero + Summary */}
        <Flex direction="column" flex={2} gap={4}>
          {/* Success hero */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            bg={useColorModeValue("green.50", "rgba(34,197,94,0.06)")}
            borderRadius="xl"
            py={8}
            px={6}
            textAlign="center"
          >
            <Box className="ift-success-circle" mb={3}>
              <IconCircleCheck size={56} color="#22C55E" fill="#22C55E" stroke="white" />
            </Box>
            <Text className="ift-success-text" fontSize="lg" fontWeight="bold" color={useColorModeValue("green.700", "#86EFAC")}>
              Beneficiary Added Successfully
            </Text>
            <Flex className="ift-success-ref" align="center" gap={2} mt={2}>
              <Text fontSize="sm" color={lc}>
                Ref: {refNo}
              </Text>
              <Tooltip label={hasCopied ? "Copied!" : "Copy"} hasArrow>
                <Box as="button" onClick={onCopy} cursor="pointer" color="accent.linkCta">
                  <IconCopy size={14} />
                </Box>
              </Tooltip>
            </Flex>
          </Flex>

          {/* Beneficiary Summary Card */}
          <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="lg" p={5}>
            <Text fontSize="sm" fontWeight="semibold" color={labelColor} mb={3}>
              Beneficiary Summary
            </Text>
            <R l="Bank Country" v={country ? `${country.flagEmoji} ${country.name}` : ""} />
            <R l="Account No / IBAN" v={form.beneficiaryAccountNo} />
            <R l="Account Type" v={form.isFabAccount ? "FAB Account" : "Non-FAB Account"} />
            <R l="Currency" v={form.beneficiaryCurrency} />
            <Box h="1px" bg={divider} my={2} />
            <R l="SWIFT Code" v={form.swiftCode} />
            <R l="Bank Name" v={form.bankName} />
            <R l="Branch" v={form.branchName} />
            <Box h="1px" bg={divider} my={2} />
            <R l="Beneficiary Name" v={form.beneficiaryName} />
            <R l="Nick Name" v={form.beneficiaryNickName} />
            <R l="Email" v={form.beneficiaryEmail} />
            <R l="Contact" v={`${form.contactCountryCode} ${form.contactNumber}`} />
          </Box>
        </Flex>

        {/* Right — Approval Timeline */}
        <Flex direction="column" flex={1} bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="lg" p={5}>
          <Text fontSize="sm" fontWeight="semibold" color={labelColor} mb={4}>
            Status
          </Text>
          <ApprovalTimeline />
          <Box mt="auto" pt={4}>
            <Text fontSize="xs" color={lc}>
              Entities: {entityNames || "—"}
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Footer */}
      <Box
        bg={footerBg}
        borderTopWidth="1px"
        borderColor={footerBorder}
        shadow="0px -2px 8px rgba(0,0,0,0.08)"
        px={{ base: 4, md: 6 }}
        py={4}
        position="sticky"
        bottom={0}
        zIndex={10}
      >
        <Flex justify="flex-end" gap={4} maxW="1000px" mx="auto" flexWrap="wrap">
          <Button
            variant="ghost"
            leftIcon={<IconDownload size={16} />}
            color="accent.linkCta"
            fontSize="sm"
            fontWeight="medium"
          >
            Download
          </Button>
          <Button
            variant="outline"
            borderColor="accent.linkCta"
            color="accent.linkCta"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            onClick={onMakeAnother}
          >
            Add Another Beneficiary
          </Button>
          <Button
            bg="accent.linkCta"
            color="white"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            px={6}
            _hover={{ bg: "blue.600" }}
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

/* ── Vertical Approval Timeline ──────────────── */

const STEPS = [
  { label: "Request Initiated", status: "completed" as const, by: "System", at: "17 Apr 2026, 10:00" },
  { label: "Submitted for Approval", status: "completed" as const, by: "Rashed Al Mazrouei", at: "17 Apr 2026, 10:01" },
  { label: "Approved", status: "pending" as const },
  { label: "Activated", status: "pending" as const },
];

function ApprovalTimeline() {
  const { dashColors } = useFabTokens();
  const completedColor = "#22C55E";
  const pendingColor = useColorModeValue("gray.300", "rgba(255,255,255,0.2)");
  const vl = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const lb = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);

  return (
    <Flex direction="column" gap={0}>
      {STEPS.map((step, i) => {
        const done = step.status === "completed";
        const isLast = i === STEPS.length - 1;
        return (
          <Flex key={i} gap={3} position="relative">
            <Flex direction="column" align="center" w="20px" flexShrink={0}>
              <Box zIndex={1} bg={useColorModeValue("white", dashColors.cardBg)} borderRadius="full">
                {done ? <IconCircleCheck size={20} color={completedColor} fill={completedColor} stroke="white" /> : <Box w="20px" h="20px" borderRadius="full" borderWidth="2px" borderColor={pendingColor} />}
              </Box>
              {!isLast && <Box w="2px" flex={1} minH="20px" bg={done && STEPS[i + 1]?.status === "completed" ? completedColor : pendingColor} />}
            </Flex>
            <Box pb={isLast ? 0 : 3}>
              <Text fontSize="2xs" fontWeight="semibold" color={done ? vl : lb} lineHeight="1.3">{step.label}</Text>
              {step.by && <Text fontSize="2xs" color={lb} lineHeight="1.3">by {step.by}</Text>}
              {step.at && <Text fontSize="2xs" color={lb} lineHeight="1.3">{step.at}</Text>}
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
}
