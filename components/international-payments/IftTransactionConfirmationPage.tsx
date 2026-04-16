"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowNarrowRight,
  IconBuildingBank,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
  IconCircleCheck,
  IconCircleDashed,
  IconCopy,
  IconCreditCard,
  IconDownload,
  IconHome,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { AuthFooter } from "@/components/auth/AuthFooter";
import type {
  IftFormData,
  IftDebitAccount,
  IftBeneficiary,
} from "@/data/iftPaymentTypes";
import { iftCountries, currencyFlagMap } from "@/data/iftPaymentMock";

/* ═══ Props & Constants ═══════════════════════════ */
interface IftTransactionConfirmationPageProps {
  form: IftFormData;
  debitAccount: IftDebitAccount | undefined;
  beneficiary: IftBeneficiary | undefined;
  onMakeAnother: () => void;
  onBackToDashboard: () => void;
}

const REF = "ST102321343423";
const INITIATOR = "Rashed Al Mazrouei";
const SUBMIT_TIME = new Date().toLocaleString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Dubai",
});

type VP = Omit<IftTransactionConfirmationPageProps, "onMakeAnother" | "onBackToDashboard">;

/* ═══ Shared: Approval Steps ════════════════════════ */
type StepStatus = "completed" | "pending";
interface ApprovalStep { label: string; status: StepStatus; by?: string; at?: string; }

function getApprovalSteps(): ApprovalStep[] {
  return [
    { label: "Initiated", status: "completed", by: INITIATOR, at: SUBMIT_TIME },
    { label: "Submitted for Approval", status: "completed", by: INITIATOR, at: SUBMIT_TIME },
    { label: "Approved", status: "pending" },
    { label: "Released", status: "pending" },
    { label: "Submitted to Bank", status: "pending" },
    { label: "Completed", status: "pending" },
  ];
}

/* ═══ Shared: Animated Success Hero ═════════════════ */
function SuccessHero({ variant }: { variant: "standard" | "gradient" | "minimal" }) {
  const { onCopy, hasCopied } = useClipboard(REF);
  const { dashColors } = useFabTokens();
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const refBg = useColorModeValue("gray.100", dashColors.surfaceElevated);
  const refBorder = useColorModeValue("gray.300", dashColors.cardBorder);
  const refText = useColorModeValue("gray.700", dashColors.pageTitle);

  if (variant === "gradient") {
    return (
      <Box
        bgGradient={useColorModeValue(
          "linear(to-b, green.50, white)",
          "linear(to-b, rgba(34,197,94,0.08), transparent)"
        )}
        borderRadius="20px"
        px={6}
        py={8}
        mb={5}
        position="relative"
        overflow="hidden"
        textAlign="center"
      >
        {/* Animated ring */}
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" w="120px" h="120px" borderRadius="full" border="2px solid" borderColor="green.200" className="ift-success-ring" opacity={0} pointerEvents="none" />

        {/* Animated circle */}
        <Flex className="ift-success-circle ift-success-glow" w="72px" h="72px" borderRadius="full" bgGradient="linear(to-br, green.400, green.600)" align="center" justify="center" mx="auto" mb={4} opacity={0}>
          <IconCheck size={40} color="white" strokeWidth={3} />
        </Flex>

        <Text className="ift-success-text" fontSize="xl" fontWeight="bold" color={vl}>
          Payment Transfer Submitted Successfully!
        </Text>

        {/* Ref pill */}
        <Flex className="ift-success-ref" align="center" gap={2} bg={refBg} borderWidth="1px" borderColor={refBorder} borderRadius="full" px={4} py={1.5} mt={4} mx="auto" w="fit-content">
          <Text fontSize="xs" color={lb} fontWeight="medium">Payment Reference No -</Text>
          <Text fontSize="sm" fontWeight="bold" color={refText} fontFamily="mono">{REF}</Text>
          <Tooltip label={hasCopied ? "Copied!" : "Copy"} fontSize="xs" hasArrow>
            <Box as="button" onClick={onCopy} cursor="pointer" display="flex" alignItems="center" color={lb} _hover={{ color: vl }}>
              {hasCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </Box>
          </Tooltip>
        </Flex>
      </Box>
    );
  }

  if (variant === "minimal") {
    const accentBg = useColorModeValue("green.50", "rgba(34,197,94,0.06)");
    const accentBd = useColorModeValue("green.200", "rgba(34,197,94,0.2)");
    return (
      <Box bg={accentBg} borderWidth="1px" borderColor={accentBd} borderRadius="16px" px={5} py={5} mb={5}>
        <Flex align="center" gap={4}>
          <Flex className="ift-success-circle" w="48px" h="48px" borderRadius="full" bg="green.500" align="center" justify="center" flexShrink={0} opacity={0}>
            <IconCheck size={28} color="white" strokeWidth={3} />
          </Flex>
          <Box flex={1}>
            <Text className="ift-success-text" fontSize="md" fontWeight="bold" color={vl}>
              Payment Transfer Submitted Successfully!
            </Text>
            <Flex className="ift-success-ref" align="center" gap={2} mt={1}>
              <Text fontSize="xs" color={lb}>Ref:</Text>
              <Text fontSize="sm" fontWeight="bold" color={refText} fontFamily="mono">{REF}</Text>
              <Tooltip label={hasCopied ? "Copied!" : "Copy"} fontSize="xs" hasArrow>
                <Box as="button" onClick={onCopy} cursor="pointer" display="flex" alignItems="center" color={lb} _hover={{ color: vl }}>
                  {hasCopied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                </Box>
              </Tooltip>
            </Flex>
          </Box>
        </Flex>
      </Box>
    );
  }

  /* standard */
  return (
    <Flex direction="column" align="center" mb={6}>
      {/* Pulse ring */}
      <Box position="relative" mb={4}>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" w="100px" h="100px" borderRadius="full" border="2px solid" borderColor={useColorModeValue("green.200", "rgba(34,197,94,0.3)")} className="ift-success-ring" opacity={0} />
        <Flex className="ift-success-circle ift-success-glow" w="64px" h="64px" borderRadius="full" bg="green.500" align="center" justify="center" opacity={0}>
          <IconCheck size={36} color="white" strokeWidth={3} />
        </Flex>
      </Box>

      <Text className="ift-success-text" fontSize="lg" fontWeight="bold" color={vl} textAlign="center">
        Payment Transfer Submitted Successfully!
      </Text>

      <Flex className="ift-success-ref" align="center" gap={2} bg={refBg} borderWidth="1px" borderColor={refBorder} borderRadius="full" px={4} py={1.5} mt={3}>
        <Text fontSize="xs" color={lb} fontWeight="medium">Payment Reference No -</Text>
        <Text fontSize="sm" fontWeight="bold" color={refText} fontFamily="mono">{REF}</Text>
        <Tooltip label={hasCopied ? "Copied!" : "Copy"} fontSize="xs" hasArrow>
          <Box as="button" onClick={onCopy} cursor="pointer" display="flex" alignItems="center" color={lb} _hover={{ color: vl }}>
            {hasCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
}

/* ═══ Shared: Collapsible Section ════════════════════ */
function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  return (
    <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="12px" overflow="hidden">
      <Flex as="button" w="full" align="center" justify="space-between" px={5} py={3} cursor="pointer" onClick={() => setIsOpen(!isOpen)} _hover={{ bg: useColorModeValue("gray.50", dashColors.surfaceElevated) }}>
        <Text fontSize="md" fontWeight="semibold" color={vl}>{title}</Text>
        {isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box px={5} pb={4}>{children}</Box>
      </Collapse>
    </Box>
  );
}

/* ═══ Shared: Approval Tracker ════════════════════════ */
function ApprovalTracker({ steps }: { steps: ApprovalStep[] }) {
  const { dashColors } = useFabTokens();
  const completedColor = useColorModeValue("green.500", "#34D399");
  const pendingColor = useColorModeValue("gray.300", dashColors.cardBorder);
  const lineCompleted = useColorModeValue("green.400", "#34D399");
  const linePending = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.700", dashColors.pageTitle);

  return (
    <Flex align="flex-start" justify="space-between" position="relative" px={2}>
      {steps.map((step, i) => {
        const done = step.status === "completed";
        const isLast = i === steps.length - 1;
        return (
          <Flex key={i} direction="column" align="center" flex={1} position="relative" zIndex={1}>
            {!isLast && (
              <Box position="absolute" top="12px" left="50%" w="100%" h="3px" bg={done && steps[i + 1]?.status === "completed" ? lineCompleted : linePending} zIndex={0} />
            )}
            <Box zIndex={1} bg={useColorModeValue("white", dashColors.surfaceBase)} borderRadius="full">
              {done ? <IconCircleCheck size={26} color={completedColor} fill={completedColor} stroke="white" /> : <IconCircleDashed size={26} color={pendingColor} />}
            </Box>
            <Text fontSize="2xs" fontWeight="semibold" color={done ? vl : lb} textAlign="center" mt={1.5} lineHeight="1.2" maxW="90px">{step.label}</Text>
            {step.by && <Text fontSize="2xs" color={lb} textAlign="center" mt={0.5} lineHeight="1.2">by {step.by}</Text>}
            {step.at && <Text fontSize="2xs" color={lb} textAlign="center" lineHeight="1.2">{step.at}</Text>}
          </Flex>
        );
      })}
    </Flex>
  );
}

/* ══════════════════════════════════════════════════════
 *  A — Classic (screenshot-faithful, collapsible accordions)
 * ══════════════════════════════════════════════════════ */
function VariantA({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const bn = b ? iftCountries.find((c) => c.code === b.countryCode) : null;
  const steps = getApprovalSteps();
  const tt = b && b.countryCode === form.orderingCountry && form.paymentCurrency === form.debitCurrency ? "Domestic Fund Transfer" : "International Fund Transfer";

  const F = ({ l, v }: { l: string; v: string }) => (
    <Box><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize="xs" fontWeight="bold" color={vl} mt={0.5} noOfLines={1} wordBreak="break-all">{v || "—"}</Text></Box>
  );

  return (
    <Box className="ift-success-content">
      <SuccessHero variant="standard" />
      <Flex direction="column" gap={4}>
        <CollapsibleSection title="Payment Summary">
          <Text fontSize="sm" fontWeight="bold" color={vl} mb={2}>Payment From</Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={4}>
            <F l="Debit Account Number" v={da?.accountNumber ?? ""} />
            <F l="Debit Account Name" v={da?.accountName ?? ""} />
          </SimpleGrid>
          <Box h="1px" bg={bd} mb={3} />
          <Text fontSize="sm" fontWeight="bold" color={vl} mb={2}>Payment To</Text>
          <SimpleGrid columns={{ base: 2, md: 5 }} gap={3} mb={3}>
            <F l="Beneficiary Account Number" v={b?.accountNumber ?? ""} />
            <F l="Beneficiary Name" v={b?.name ?? ""} />
            <F l="Beneficiary Nick Name" v={b?.nickName ?? ""} />
            <F l="Payment Amount" v={`${currencyFlagMap[form.paymentCurrency] ?? ""} ${form.paymentCurrency} ${form.paymentAmount ? Number(form.paymentAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`} />
            <F l="Payment Date" v={form.paymentDate} />
          </SimpleGrid>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}><F l="Transaction Type" v={tt} /></SimpleGrid>
        </CollapsibleSection>
        <CollapsibleSection title="Approval Tracker"><ApprovalTracker steps={steps} /></CollapsibleSection>
      </Flex>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════
 *  B — Card Receipt (bank receipt / ticket style)
 * ══════════════════════════════════════════════════════ */
function VariantB({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const sectionAccent = useColorModeValue("blue.500", "#3B82F6");
  const bn = b ? iftCountries.find((c) => c.code === b.countryCode) : null;
  const steps = getApprovalSteps();
  const cr = form.paymentCurrency !== form.debitCurrency;
  const tt = b && b.countryCode === form.orderingCountry && form.paymentCurrency === form.debitCurrency ? "Domestic Fund Transfer" : "International Fund Transfer";

  const R = ({ l, v, highlight }: { l: string; v: string; highlight?: boolean }) => (
    <Flex justify="space-between" py={1.5} borderBottomWidth="1px" borderColor={bd} _last={{ borderBottom: "none" }} gap={3}>
      <Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text>
      <Text fontSize="xs" fontWeight="semibold" color={highlight ? ac : vl} textAlign="right" noOfLines={1}>{v || "—"}</Text>
    </Flex>
  );

  return (
    <Box className="ift-success-content">
      <SuccessHero variant="gradient" />

      {/* Receipt card */}
      <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="16px" overflow="hidden" maxW="640px" mx="auto">
        {/* Amount band */}
        <Box bgGradient={useColorModeValue("linear(to-r, blue.500, blue.600)", "linear(to-r, rgba(0,98,255,0.3), rgba(0,98,255,0.15))")} px={5} py={3}>
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Amount Sent</Text>
              <Text fontSize="xl" fontWeight="bold" color="white">
                {currencyFlagMap[form.paymentCurrency] ?? ""} {form.paymentCurrency} {form.paymentAmount ? Number(form.paymentAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
              </Text>
            </Box>
            {cr && (
              <Box textAlign="right">
                <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Debited</Text>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {currencyFlagMap[form.debitCurrency] ?? ""} {form.debitCurrency} {form.debitAmount || "—"}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Dashed tear line */}
        <Box position="relative" h="1px" mx={4}>
          <Box position="absolute" left={0} right={0} top={0} borderTopWidth="2px" borderStyle="dashed" borderColor={bd} />
        </Box>

        {/* Details */}
        <Box px={5} py={3}>
          {/* From → To flow */}
          <Flex align="center" gap={2} mb={2}>
            <IconCreditCard size={14} color={sectionAccent} />
            <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">From</Text>
          </Flex>
          <R l="Account" v={`${da?.accountNumber ?? ""} · ${da?.accountName ?? ""}`} />
          <R l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} />

          <Box h="1px" bg={bd} my={2} />

          <Flex align="center" gap={2} mb={2}>
            <IconUser size={14} color={useColorModeValue("#8B5CF6", "#A78BFA")} />
            <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">To</Text>
          </Flex>
          <R l="Beneficiary" v={`${b?.name ?? ""} (${b?.nickName ?? ""})`} />
          <R l="Account" v={b?.accountNumber ?? ""} />
          <R l="Bank" v={`${b?.bankName ?? ""} · ${b?.swiftCode ?? ""}`} />
          <R l="Country" v={bn ? `${bn.flagEmoji ?? ""} ${bn.name}` : ""} />

          <Box h="1px" bg={bd} my={2} />

          <Flex align="center" gap={2} mb={2}>
            <IconCalendar size={14} color={useColorModeValue("#0D9488", "#2DD4BF")} />
            <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">Details</Text>
          </Flex>
          <R l="Payment Date" v={form.paymentDate} />
          <R l="Transaction Type" v={tt} />
          <R l="Purpose" v={form.purposeOfPayment} />
          <R l="Charges" v={form.chargeType} />
          <R l="Customer Reference" v={form.customerReference} />
        </Box>

        {/* Approval tracker inline */}
        <Box bg={useColorModeValue("gray.50", dashColors.surfaceElevated)} px={5} py={4} borderTopWidth="1px" borderColor={bd}>
          <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider" mb={3}>Approval Tracker</Text>
          <ApprovalTracker steps={steps} />
        </Box>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════
 *  C — Split Card (From→To visual + timeline sidebar)
 * ══════════════════════════════════════════════════════ */
function VariantC({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const se = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const bn = b ? iftCountries.find((c) => c.code === b.countryCode) : null;
  const steps = getApprovalSteps();
  const tt = b && b.countryCode === form.orderingCountry && form.paymentCurrency === form.debitCurrency ? "Domestic Fund Transfer" : "International Fund Transfer";
  const cr = form.paymentCurrency !== form.debitCurrency;

  const F = ({ l, v, bold }: { l: string; v: string; bold?: boolean }) => (
    <Box><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize={bold ? "sm" : "xs"} fontWeight={bold ? "bold" : "semibold"} color={vl} mt={0.5} noOfLines={1}>{v || "—"}</Text></Box>
  );

  /* Vertical timeline for approval */
  const VerticalTracker = () => {
    const completedColor = useColorModeValue("green.500", "#34D399");
    const pendingColor = useColorModeValue("gray.300", dashColors.cardBorder);
    return (
      <Flex direction="column" gap={0}>
        {steps.map((step, i) => {
          const done = step.status === "completed";
          const isLast = i === steps.length - 1;
          return (
            <Flex key={i} gap={3} position="relative">
              <Flex direction="column" align="center" w="20px" flexShrink={0}>
                <Box zIndex={1} bg={useColorModeValue("white", dashColors.surfaceBase)} borderRadius="full">
                  {done ? <IconCircleCheck size={20} color={completedColor} fill={completedColor} stroke="white" /> : <IconCircleDashed size={20} color={pendingColor} />}
                </Box>
                {!isLast && <Box w="2px" flex={1} minH="20px" bg={done && steps[i + 1]?.status === "completed" ? completedColor : pendingColor} />}
              </Flex>
              <Box pb={isLast ? 0 : 3}>
                <Text fontSize="2xs" fontWeight="semibold" color={done ? vl : lb} lineHeight="1.3">{step.label}</Text>
                {step.by && <Text fontSize="2xs" color={lb} lineHeight="1.2">by {step.by} · {step.at}</Text>}
              </Box>
            </Flex>
          );
        })}
      </Flex>
    );
  };

  return (
    <Box className="ift-success-content">
      <SuccessHero variant="minimal" />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        {/* Left: From → To */}
        <Box gridColumn={{ base: "1", md: "1 / 3" }}>
          <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="16px" overflow="hidden">
            {/* Amount header */}
            <Box bgGradient={useColorModeValue("linear(to-r, blue.500, blue.600)", "linear(to-r, rgba(0,98,255,0.3), rgba(0,98,255,0.15))")} px={5} py={3}>
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Sent</Text>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {currencyFlagMap[form.paymentCurrency] ?? ""} {form.paymentCurrency} {form.paymentAmount ? Number(form.paymentAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                  </Text>
                </Box>
                <Flex align="center" gap={2}>
                  <IconArrowNarrowRight size={16} color="white" />
                </Flex>
                {cr && (
                  <Box textAlign="right">
                    <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Debited</Text>
                    <Text fontSize="lg" fontWeight="bold" color="white">{currencyFlagMap[form.debitCurrency] ?? ""} {form.debitCurrency} {form.debitAmount || "—"}</Text>
                  </Box>
                )}
              </Flex>
            </Box>

            {/* From / To split */}
            <SimpleGrid columns={{ base: 1, md: 2 }}>
              <Box p={4} borderRightWidth={{ base: 0, md: "1px" }} borderColor={bd}>
                <HStack mb={2} pb={1} borderBottomWidth="1px" borderColor={bd}>
                  <IconCreditCard size={14} color={useColorModeValue("#3B82F6", "#60A5FA")} />
                  <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">From</Text>
                </HStack>
                <SimpleGrid columns={2} gap={3}>
                  <F l="Account Number" v={da?.accountNumber ?? ""} />
                  <F l="Account Name" v={da?.accountName ?? ""} />
                  <F l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} />
                  <F l="IBAN" v={da?.iban ?? ""} />
                </SimpleGrid>
              </Box>
              <Box p={4}>
                <HStack mb={2} pb={1} borderBottomWidth="1px" borderColor={bd}>
                  <IconUser size={14} color={useColorModeValue("#8B5CF6", "#A78BFA")} />
                  <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">To</Text>
                </HStack>
                <SimpleGrid columns={2} gap={3}>
                  <F l="Beneficiary Name" v={b?.name ?? ""} />
                  <F l="Nick Name" v={b?.nickName ?? ""} />
                  <F l="Account Number" v={b?.accountNumber ?? ""} />
                  <F l="Bank" v={`${b?.bankName ?? ""}`} />
                  <F l="SWIFT / BIC" v={b?.swiftCode ?? ""} />
                  <F l="Country" v={bn ? `${bn.flagEmoji ?? ""} ${bn.name}` : ""} />
                </SimpleGrid>
              </Box>
            </SimpleGrid>

            {/* Payment details band */}
            <Box bg={se} px={5} py={3} borderTopWidth="1px" borderColor={bd}>
              <SimpleGrid columns={{ base: 3, md: 6 }} gap={3}>
                <F l="Date" v={form.paymentDate} />
                <F l="Type" v={tt} />
                <F l="Purpose" v={form.purposeOfPayment} />
                <F l="Charges" v={form.chargeType} />
                <F l="Customer Ref" v={form.customerReference} />
                <F l="Charge Account" v={form.chargeAccountNumber} />
              </SimpleGrid>
            </Box>
          </Box>
        </Box>

        {/* Right: Vertical approval timeline */}
        <Box>
          <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="16px" p={4}>
            <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider" mb={4}>
              Approval Tracker
            </Text>
            <VerticalTracker />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════
 *  Main Export — 3-variant picker
 * ══════════════════════════════════════════════════════ */
export function IftTransactionConfirmationPage(props: IftTransactionConfirmationPageProps) {
  const { form, debitAccount, beneficiary, onMakeAnother, onBackToDashboard } = props;
  const [variant, setVariant] = useState<"A" | "B" | "C">("B");

  const { dashColors, dashGradients } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerBorderColor = useColorModeValue("#d7d7d7", dashColors.sectionDivider);
  const breadcrumbLink = useColorModeValue("accent.linkCta", "#60A5FA");
  const breadcrumbText = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const footerBg = useColorModeValue("white", dashColors.surfaceBase);
  const footerBorder = useColorModeValue("rgba(168,172,178,0.4)", dashColors.sectionDivider);
  const activeBg = useColorModeValue("blue.500", "#60A5FA");
  const inactiveBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const vp = { form, debitAccount, beneficiary };
  const VS: { key: typeof variant; label: string }[] = [
    { key: "A", label: "Classic" },
    { key: "B", label: "Receipt" },
    { key: "C", label: "Split" },
  ];

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("transparent", dashColors.surfaceBase)} bgImage={useColorModeValue("none", dashGradients.canvas)}>
      {/* ─── Header ─── */}
      <Box borderBottomWidth="1px" borderColor={headerBorderColor} px={{ base: 3, md: 6 }} py={2} position="sticky" top={0} zIndex={10}>
        <Flex align="center" gap={2}>
          <Box as="button" borderRadius="sm" p={1} display="flex" alignItems="center" cursor="pointer" color={labelColor} onClick={onBackToDashboard}>
            <IconChevronLeft size={16} />
          </Box>
          <Box>
            <HStack spacing={1} fontSize="2xs">
              <Text color={breadcrumbLink} cursor="pointer">Home</Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbLink} cursor="pointer">Payments</Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbText}>Transaction Confirmation</Text>
            </HStack>
            <Text fontSize="md" fontWeight="medium" color={breadcrumbText} mt={0.5}>Transaction Confirmation</Text>
          </Box>
          <HStack bg={inactiveBg} borderRadius="full" p={0.5} spacing={0} ml="auto">
            {VS.map((v) => (
              <Button key={v.key} size="xs" borderRadius="full" bg={variant === v.key ? activeBg : "transparent"} color={variant === v.key ? "white" : useColorModeValue("gray.600", dashColors.pageSubtitle)} fontWeight="medium" fontSize="2xs" h="24px" px={3} _hover={{ bg: variant === v.key ? activeBg : useColorModeValue("gray.200", dashColors.cardBg) }} onClick={() => setVariant(v.key)}>
                {v.label}
              </Button>
            ))}
          </HStack>
        </Flex>
      </Box>

      {/* ─── Content ─── */}
      <Box flex={1} maxW="1000px" mx="auto" w="full" px={{ base: 3, md: 6 }} py={4}>
        {variant === "A" && <VariantA {...vp} />}
        {variant === "B" && <VariantB {...vp} />}
        {variant === "C" && <VariantC {...vp} />}
      </Box>

      {/* ─── Footer ─── */}
      <Box bg={footerBg} borderTopWidth="1px" borderColor={footerBorder} shadow="0px -2px 8px rgba(0,0,0,0.08)" px={{ base: 3, md: 6 }} py={2} position="sticky" bottom={0} zIndex={10}>
        <Flex justify="flex-end" gap={3} maxW="1000px" mx="auto">
          <Tooltip label="Download confirmation" fontSize="xs" hasArrow>
            <Button variant="ghost" color={useColorModeValue("gray.600", dashColors.pageSubtitle)} borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" leftIcon={<IconDownload size={14} />} _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}>
              Download
            </Button>
          </Tooltip>
          <Button variant="outline" borderColor="accent.linkCta" color="accent.linkCta" borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" leftIcon={<IconPlus size={14} />} _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }} onClick={onMakeAnother}>
            Make Another Payment
          </Button>
          <Button bg="accent.linkCta" color="white" borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" px={6} leftIcon={<IconHome size={14} />} _hover={{ bg: "blue.600" }} onClick={onBackToDashboard}>
            Back to Dashboard
          </Button>
        </Flex>
      </Box>
      <AuthFooter />
    </Flex>
  );
}
