"use client";

import { useState, useCallback } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconArrowNarrowRight,
  IconBuildingBank,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconClock,
  IconCopy,
  IconCreditCard,
  IconDownload,
  IconFile,
  IconFileText,
  IconInfoCircle,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { AuthFooter } from "@/components/auth/AuthFooter";
import type { IftFormData, IftDebitAccount, IftBeneficiary, IftSummaryRow } from "@/data/iftPaymentTypes";
import { iftCountries, currencyFlagMap, iftLimitsInfo, iftFxRates } from "@/data/iftPaymentMock";

/* ═══ Props & Helpers ═══════════════════════════ */
interface IftReviewSummaryPageProps {
  form: IftFormData;
  debitAccount: IftDebitAccount | undefined;
  beneficiary: IftBeneficiary | undefined;
  summaryRows: IftSummaryRow[];
  onBack: () => void;
  onConfirm: () => void;
}
type VP = Omit<IftReviewSummaryPageProps, "onBack" | "onConfirm">;

function bc(code: string) { const c = iftCountries.find((ct) => ct.code === code); return { ccy: c?.currency ?? "", flag: c?.flagEmoji ?? "", name: c?.name ?? code }; }
const REF = "ST102321343423";
function fa(ccy: string, amt: string) { return amt ? `${currencyFlagMap[ccy] ?? ""} ${ccy} ${amt}` : "—"; }
function fx(from: string, to: string) { const r = iftFxRates[from]?.[to]; return r ? `${from} = ${r} ${to}` : ""; }
function tt(form: IftFormData, b: IftBeneficiary | undefined) { if (!b) return "—"; return (b.countryCode === form.orderingCountry && form.paymentCurrency === form.debitCurrency) ? "Domestic Fund Transfer" : "International Fund Transfer"; }

/* ═══ Shared: Prominent Reference Banner with Copy ═══ */
function RefBanner({ variant }: { variant?: "hero" | "bar" }) {
  const { onCopy, hasCopied } = useClipboard(REF);
  const { dashColors } = useFabTokens();
  const barBg = useColorModeValue("blue.50", "rgba(0,98,255,0.10)");
  const barBorder = useColorModeValue("blue.200", "rgba(96,165,250,0.25)");
  const refColor = useColorModeValue("blue.700", "#93C5FD");
  const labelColor = useColorModeValue("gray.500", dashColors.pageSubtitle);

  if (variant === "hero") {
    return (
      <Flex align="center" gap={2}>
        <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Reference</Text>
        <Text fontSize="sm" fontWeight="bold" color="white" letterSpacing="wide">{REF}</Text>
        <Tooltip label={hasCopied ? "Copied!" : "Copy Ref"} fontSize="xs" hasArrow>
          <Box as="button" onClick={onCopy} color="whiteAlpha.800" _hover={{ color: "white" }} cursor="pointer" display="flex" alignItems="center">
            {hasCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </Box>
        </Tooltip>
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="space-between" bg={barBg} borderWidth="1px" borderColor={barBorder} borderRadius="12px" px={4} py={2} mb={3}>
      <Flex align="center" gap={2}>
        <IconFileText size={14} color={useColorModeValue("#3B82F6", "#60A5FA")} />
        <Text fontSize="2xs" color={labelColor} fontWeight="medium" textTransform="uppercase" letterSpacing="wider">Reference Number</Text>
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="sm" fontWeight="bold" color={refColor} letterSpacing="wide" fontFamily="mono">{REF}</Text>
        <Tooltip label={hasCopied ? "Copied!" : "Copy Ref"} fontSize="xs" hasArrow>
          <Box as="button" onClick={onCopy} color={refColor} _hover={{ opacity: 0.7 }} cursor="pointer" display="flex" alignItems="center" p={1} borderRadius="md" bg={useColorModeValue("blue.100", "rgba(96,165,250,0.15)")}>
            {hasCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
}

/* ══════════════════════════════════════════════════
 *  A — 3-Column Card Grid
 * ══════════════════════════════════════════════════ */
function VariantA({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const hd = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const sectionAccent = useColorModeValue("blue.500", "#3B82F6");
  const co = iftCountries.find((c) => c.code === form.orderingCountry);
  const bn = b ? bc(b.countryCode) : null;
  const cr = form.paymentCurrency !== form.debitCurrency;

  const C = ({ icon, t, ch, accent }: { icon: React.ReactElement; t: string; ch: React.ReactNode; accent?: string }) => (
    <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="14px" overflow="hidden" borderLeftWidth="3px" borderLeftColor={accent || sectionAccent}>
      <Flex align="center" gap={1.5} px={3} py={1.5} bg={hd} borderBottomWidth="1px" borderColor={bd}>
        <Box color={accent || sectionAccent}>{icon}</Box><Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">{t}</Text>
      </Flex>
      <Box px={3} py={1.5}>{ch}</Box>
    </Box>
  );
  const F = ({ l, v, highlight }: { l: string; v: string; highlight?: boolean }) => (
    <Flex justify="space-between" py={0.5} gap={2}><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize="xs" fontWeight="medium" color={highlight ? ac : vl} textAlign="right" noOfLines={1}>{v || "—"}</Text></Flex>
  );

  return (
    <Box>
      <RefBanner />
      <Box bg={useColorModeValue("blue.50", "rgba(0,98,255,0.08)")} borderRadius="14px" px={4} py={2.5} mb={3} borderWidth="1px" borderColor={useColorModeValue("blue.100", "rgba(96,165,250,0.2)")}>
        <Flex align="center" justify="space-between" gap={2}>
          <Box><Text fontSize="2xs" color={lb} textTransform="uppercase" letterSpacing="wider">Payment Amount</Text><Text fontSize="lg" fontWeight="bold" color={vl}>{fa(form.paymentCurrency, form.paymentAmount)}</Text></Box>
          {cr && <><IconArrowNarrowRight size={14} color="gray" /><Box textAlign="right"><Text fontSize="2xs" color={lb} textTransform="uppercase" letterSpacing="wider">Debit Amount</Text><Text fontSize="md" fontWeight="bold" color={vl}>{fa(form.debitCurrency, form.debitAmount)}</Text></Box></>}
          <Flex direction="column" align="flex-end" gap={0.5}>
            <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>FX Rate</Text><Text fontSize="xs" fontWeight="bold" color={vl}>{fx(form.debitCurrency, form.paymentCurrency) || "Same ccy"}</Text></Flex>
            <Flex align="center" gap={1}><IconCalendar size={11} color="gray" /><Text fontSize="2xs" color={lb}>{form.paymentDate}</Text></Flex>
          </Flex>
        </Flex>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
        <C icon={<IconCreditCard size={14} />} t="Debit Account" ch={<><F l="Account Number" v={da?.accountNumber ?? ""} /><F l="Account Name" v={da?.accountName ?? ""} /><F l="IBAN" v={da?.iban ?? ""} /><F l="Balance" v={da ? `AED ${da.balance.toLocaleString()}` : ""} highlight /><F l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} /><F l="Overdraft Limit" v={`AED ${(da?.overdraftLimit ?? 0).toFixed(2)}`} /><F l="Frozen Amount" v={`AED ${(da?.frozenAmount ?? 0).toFixed(2)}`} /><F l="Country" v={co ? `${co.flagEmoji} ${co.name}` : ""} /></>} />
        <C icon={<IconUser size={14} />} t="Beneficiary" accent={useColorModeValue("purple.500", "#A78BFA")} ch={<><F l="Nick Name" v={b?.nickName ?? ""} /><F l="Name" v={b?.name ?? ""} /><F l="Account Number" v={b?.accountNumber ?? ""} /><F l="Currency" v={bn ? `${bn.flag} ${bn.ccy}` : ""} /><F l="Bank" v={b?.bankName ?? ""} /><F l="Branch" v={b?.bankBranch ?? ""} /><F l="SWIFT / BIC" v={b?.swiftCode ?? ""} /><F l="Country" v={bn ? `${bn.flag} ${bn.name}` : ""} /><F l="City" v={b?.bankCity ?? ""} />{b?.verificationStatus && <Flex justify="space-between" py={0.5}><Text fontSize="2xs" color={lb} fontWeight="medium">Verification</Text><Badge colorScheme={b.verificationStatus === "Verified" ? "green" : b.verificationStatus === "Pending" ? "yellow" : "red"} fontSize="2xs" borderRadius="md" px={2}>{b.verificationStatus}</Badge></Flex>}</>} />
        <C icon={<IconWorld size={14} />} t="Payment Details" accent={useColorModeValue("teal.500", "#2DD4BF")} ch={<><F l="Payment Date" v={form.paymentDate} /><F l="Payment Amount" v={fa(form.paymentCurrency, form.paymentAmount)} /><F l="Debit Amount" v={fa(form.debitCurrency, form.debitAmount)} /><F l="FX Rate" v={fx(form.debitCurrency, form.paymentCurrency)} highlight /><F l="Type" v={tt(form, b)} /><F l="Purpose" v={form.purposeOfPayment} /><F l="Customer Ref" v={form.customerReference} /><F l="Bene Purpose" v={form.beneficiaryPurpose} /><F l="Charges" v={form.chargeType} /><F l="Charge Account" v={form.chargeAccountNumber} /></>} />
        <C icon={<IconClock size={14} />} t="Transfer Limits" accent={useColorModeValue("orange.500", "#FB923C")} ch={<><F l="Cut-off Time" v={iftLimitsInfo.cutOffTime} /><F l="Available Limit" v={iftLimitsInfo.availableLimit} highlight /><F l="Utilised Limit" v={iftLimitsInfo.utilisedLimit} /></>} />
        {form.intermediarySwiftCode && <C icon={<IconBuildingBank size={14} />} t="Intermediary Bank" accent={useColorModeValue("gray.500", "#9CA3AF")} ch={<><F l="SWIFT" v={form.intermediarySwiftCode} /><F l="Bank Name" v={form.intermediaryBankName} /><F l="Country" v={form.intermediaryCountry} /></>} />}
        {form.uploadedDocuments && form.uploadedDocuments.length > 0 && <C icon={<IconFile size={14} />} t="Uploaded Documents" accent={useColorModeValue("cyan.600", "#22D3EE")} ch={<>{form.uploadedDocuments.map((d, i) => <Flex key={i} align="center" gap={1.5} py={0.5}><IconFileText size={12} /><Text fontSize="xs" color={ac} cursor="pointer" _hover={{ textDecoration: "underline" }}>{d}</Text></Flex>)}</>} />}
      </SimpleGrid>
    </Box>
  );
}

/* ══════════════════════════════════════════════════
 *  B — 2-Column Timeline
 * ══════════════════════════════════════════════════ */
function VariantB({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const dot = useColorModeValue("blue.500", "#60A5FA");
  const ln = useColorModeValue("blue.100", dashColors.cardBorder);
  const co = iftCountries.find((c) => c.code === form.orderingCountry);
  const bn = b ? bc(b.countryCode) : null;
  const cr = form.paymentCurrency !== form.debitCurrency;

  const S = ({ t, icon, last, ch }: { t: string; icon: React.ReactElement; last?: boolean; ch: React.ReactNode }) => (
    <Flex gap={2}>
      <Flex direction="column" align="center" w="18px" flexShrink={0}>
        <Flex w="18px" h="18px" borderRadius="full" bg={dot} color="white" align="center" justify="center" flexShrink={0}>{icon}</Flex>
        {!last && <Box w="2px" flex={1} bg={ln} mt={0.5} />}
      </Flex>
      <Box flex={1} pb={last ? 0 : 2}>
        <Text fontSize="2xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider" mb={0.5}>{t}</Text>
        <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="lg" px={3} py={1.5}>{ch}</Box>
      </Box>
    </Flex>
  );
  const R = ({ l, v, highlight }: { l: string; v: string; highlight?: boolean }) => (
    <Flex justify="space-between" py={0.5} gap={2}><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize="xs" fontWeight="medium" color={highlight ? ac : vl} textAlign="right" noOfLines={1}>{v || "—"}</Text></Flex>
  );

  return (
    <Box>
      <RefBanner />
      <Box bg={useColorModeValue("blue.50", "rgba(0,98,255,0.08)")} borderRadius="14px" px={4} py={2.5} mb={3} borderWidth="1px" borderColor={useColorModeValue("blue.100", "rgba(96,165,250,0.2)")}>
        <Flex align="center" justify="space-between" gap={2}>
          <Box><Text fontSize="2xs" color={lb} textTransform="uppercase" letterSpacing="wider">Payment Amount</Text><Text fontSize="lg" fontWeight="bold" color={vl}>{fa(form.paymentCurrency, form.paymentAmount)}</Text></Box>
          {cr && <><IconArrowNarrowRight size={14} color="gray" /><Box textAlign="right"><Text fontSize="2xs" color={lb} textTransform="uppercase" letterSpacing="wider">Debit Amount</Text><Text fontSize="md" fontWeight="bold" color={vl}>{fa(form.debitCurrency, form.debitAmount)}</Text></Box></>}
          <Flex direction="column" align="flex-end" gap={0.5}>
            <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>FX</Text><Text fontSize="xs" fontWeight="bold" color={vl}>{fx(form.debitCurrency, form.paymentCurrency) || "Same ccy"}</Text></Flex>
            <Flex align="center" gap={1}><IconCalendar size={11} color="gray" /><Text fontSize="2xs" color={lb}>{form.paymentDate}</Text></Flex>
          </Flex>
        </Flex>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        <Box>
          <S t="Debit Account" icon={<IconCreditCard size={10} />} ch={<><R l="Account Number" v={da?.accountNumber ?? ""} /><R l="Account Name" v={da?.accountName ?? ""} /><R l="IBAN" v={da?.iban ?? ""} /><R l="Balance" v={da ? `AED ${da.balance.toLocaleString()}` : ""} highlight /><R l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} /><R l="Overdraft Limit" v={`AED ${(da?.overdraftLimit ?? 0).toFixed(2)}`} /><R l="Frozen Amount" v={`AED ${(da?.frozenAmount ?? 0).toFixed(2)}`} /><R l="Country" v={co ? `${co.flagEmoji} ${co.name}` : ""} /></>} />
          <S t="Payment Details" icon={<IconCalendar size={10} />} ch={<><R l="Payment Date" v={form.paymentDate} /><R l="Payment Amount" v={fa(form.paymentCurrency, form.paymentAmount)} /><R l="Debit Amount" v={fa(form.debitCurrency, form.debitAmount)} /><R l="FX Rate" v={fx(form.debitCurrency, form.paymentCurrency)} highlight /><R l="Type" v={tt(form, b)} /><R l="Purpose" v={form.purposeOfPayment} /></>} />
          <S t="Transfer Limits" icon={<IconClock size={10} />} last={!form.intermediarySwiftCode} ch={<><R l="Cut-off Time" v={iftLimitsInfo.cutOffTime} /><R l="Available Limit" v={iftLimitsInfo.availableLimit} highlight /><R l="Utilised Limit" v={iftLimitsInfo.utilisedLimit} /></>} />
          {form.intermediarySwiftCode && <S t="Intermediary Bank" icon={<IconBuildingBank size={10} />} last ch={<><R l="SWIFT" v={form.intermediarySwiftCode} /><R l="Bank Name" v={form.intermediaryBankName} /><R l="Country" v={form.intermediaryCountry} /></>} />}
        </Box>
        <Box>
          <S t="Beneficiary" icon={<IconUser size={10} />} ch={<><R l="Nick Name" v={b?.nickName ?? ""} /><R l="Name" v={b?.name ?? ""} /><R l="Account Number" v={b?.accountNumber ?? ""} /><R l="Currency" v={bn ? `${bn.flag} ${bn.ccy}` : ""} /><R l="Bank Name" v={b?.bankName ?? ""} /><R l="Branch" v={b?.bankBranch ?? ""} /><R l="SWIFT / BIC" v={b?.swiftCode ?? ""} /><R l="Country" v={bn ? `${bn.flag} ${bn.name}` : ""} /><R l="City" v={b?.bankCity ?? ""} />{b?.verificationStatus && <Flex justify="space-between" py={0.5}><Text fontSize="2xs" color={lb} fontWeight="medium">Verification</Text><Badge colorScheme={b.verificationStatus === "Verified" ? "green" : b.verificationStatus === "Pending" ? "yellow" : "red"} fontSize="2xs" borderRadius="md" px={2}>{b.verificationStatus}</Badge></Flex>}</>} />
          <S t="Charges & Reference" icon={<IconFileText size={10} />} ch={<><R l="Customer Reference" v={form.customerReference} /><R l="Bene Purpose" v={form.beneficiaryPurpose} /><R l="Charge Type" v={form.chargeType} /><R l="Charge Account" v={form.chargeAccountNumber} /></>} />
          {form.uploadedDocuments && form.uploadedDocuments.length > 0 && <S t="Uploaded Documents" icon={<IconFile size={10} />} last ch={<>{form.uploadedDocuments.map((d, i) => <Flex key={i} align="center" gap={1.5} py={0.5}><IconFileText size={12} /><Text fontSize="xs" color={ac} cursor="pointer" _hover={{ textDecoration: "underline" }}>{d}</Text></Flex>)}</>} />}
        </Box>
      </SimpleGrid>
    </Box>
  );
}

/* ══════════════════════════════════════════════════
 *  C — 2-Column Ledger
 * ══════════════════════════════════════════════════ */
function VariantC({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const se = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const sectionAccent = useColorModeValue("blue.500", "#3B82F6");
  const co = iftCountries.find((c) => c.code === form.orderingCountry);
  const bn = b ? bc(b.countryCode) : null;
  const cr = form.paymentCurrency !== form.debitCurrency;

  /* Section card with colored left accent bar + icon header */
  const Section = ({ title, icon, children, accent }: { title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }) => (
    <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="12px" overflow="hidden" borderLeftWidth="3px" borderLeftColor={accent || sectionAccent}>
      <Flex align="center" gap={2} px={4} py={2} bg={se} borderBottomWidth="1px" borderColor={bd}>
        <Box color={accent || sectionAccent} flexShrink={0}>{icon}</Box>
        <Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">{title}</Text>
      </Flex>
      <Box>{children}</Box>
    </Box>
  );

  /* Data row — 2-column grid for alignment */
  const R = ({ l, v, highlight }: { l: string; v: string; highlight?: boolean }) => (
    <SimpleGrid columns={2} px={4} py={1.5} borderBottomWidth="1px" borderColor={bd} _last={{ borderBottom: "none" }} bg={highlight ? useColorModeValue("blue.50", "rgba(59,130,246,0.06)") : "transparent"}>
      <Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text>
      <Text fontSize="xs" fontWeight="medium" color={highlight ? ac : vl} textAlign="right" noOfLines={1}>{v || "—"}</Text>
    </SimpleGrid>
  );

  return (
    <Box borderRadius="20px" overflow="hidden">
      {/* ─── Hero Header (kept as-is) ─── */}
      <Box bgGradient={useColorModeValue("linear(to-r, blue.500, blue.600)", "linear(to-r, rgba(0,98,255,0.3), rgba(0,98,255,0.15))")} px={5} py={3} borderTopRadius="20px">
        <Flex align="center" justify="space-between" gap={2}>
          <Box>
            <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Payment Amount</Text>
            <Text fontSize="xl" fontWeight="bold" color="white">{fa(form.paymentCurrency, form.paymentAmount)}</Text>
          </Box>
          {cr && (
            <Box textAlign="right">
              <Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Debit Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="white">{fa(form.debitCurrency, form.debitAmount)}</Text>
            </Box>
          )}
        </Flex>
        <Flex gap={2} mt={1.5} align="center" justify="space-between">
          <RefBanner variant="hero" />
          <Flex gap={2}>
            <Badge bg="whiteAlpha.200" color="white" fontSize="2xs" px={2} py={0.5} borderRadius="md">FX: {fx(form.debitCurrency, form.paymentCurrency) || "Same"}</Badge>
            <Badge bg="whiteAlpha.200" color="white" fontSize="2xs" px={2} py={0.5} borderRadius="md">{form.paymentDate}</Badge>
          </Flex>
        </Flex>
      </Box>

      {/* ─── Data Sections ─── */}
      <Box bg={useColorModeValue("gray.50", dashColors.surfaceBase)} px={4} py={4} borderBottomRadius="20px" borderWidth="1px" borderTopWidth={0} borderColor={bd}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Left column */}
          <Flex direction="column" gap={4}>
            <Section title="Debit Account" icon={<IconCreditCard size={15} />}>
              <R l="Account Number" v={da?.accountNumber ?? ""} />
              <R l="Account Name" v={da?.accountName ?? ""} />
              <R l="IBAN" v={da?.iban ?? ""} />
              <R l="Balance" v={da ? `AED ${da.balance.toLocaleString()}` : ""} highlight />
              <R l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} />
              <R l="Overdraft Limit" v={`AED ${(da?.overdraftLimit ?? 0).toFixed(2)}`} />
              <R l="Frozen Amount" v={`AED ${(da?.frozenAmount ?? 0).toFixed(2)}`} />
              <R l="Country" v={co ? `${co.flagEmoji} ${co.name}` : ""} />
            </Section>

            <Section title="Payment Details" icon={<IconFileText size={15} />} accent={useColorModeValue("teal.500", "#2DD4BF")}>
              <R l="Payment Date" v={form.paymentDate} />
              <R l="Transaction Type" v={tt(form, b)} />
              <R l="Purpose of Payment" v={form.purposeOfPayment} />
              <R l="Customer Reference" v={form.customerReference} />
              <R l="Charge Type" v={form.chargeType} />
              <R l="Charge Account" v={form.chargeAccountNumber} />
              {cr && <R l="FX Rate" v={fx(form.debitCurrency, form.paymentCurrency) || "—"} highlight />}
            </Section>
          </Flex>

          {/* Right column */}
          <Flex direction="column" gap={4}>
            <Section title="Beneficiary" icon={<IconUser size={15} />} accent={useColorModeValue("purple.500", "#A78BFA")}>
              {b?.nickName && <R l="Nick Name" v={b.nickName} />}
              <R l="Beneficiary Name" v={b?.name ?? ""} />
              <R l="Account Number" v={b?.accountNumber ?? ""} />
              <R l="Currency" v={bn ? `${bn.flag} ${bn.ccy}` : ""} />
              <R l="Bank Name" v={b?.bankName ?? ""} />
              <R l="Branch" v={b?.bankBranch ?? ""} />
              <R l="SWIFT / BIC" v={b?.swiftCode ?? ""} />
              <R l="Country" v={bn ? `${bn.flag} ${bn.name}` : ""} />
              <R l="City" v={b?.bankCity ?? ""} />
              {b?.verificationStatus && (
                <SimpleGrid columns={2} px={4} py={1.5} _last={{ borderBottom: "none" }}>
                  <Text fontSize="2xs" color={lb} fontWeight="medium">Verification</Text>
                  <Flex justify="flex-end"><Badge colorScheme={b.verificationStatus === "Verified" ? "green" : b.verificationStatus === "Pending" ? "yellow" : "red"} fontSize="2xs" borderRadius="md" px={2}>{b.verificationStatus}</Badge></Flex>
                </SimpleGrid>
              )}
            </Section>

            <Section title="Transfer Limits" icon={<IconClock size={15} />} accent={useColorModeValue("orange.500", "#FB923C")}>
              <R l="Cut-off Time" v={iftLimitsInfo.cutOffTime} />
              <R l="Available Limit" v={iftLimitsInfo.availableLimit} highlight />
              <R l="Utilised Limit" v={iftLimitsInfo.utilisedLimit} />
            </Section>

            {form.uploadedDocuments && form.uploadedDocuments.length > 0 && (
              <Section title="Uploaded Documents" icon={<IconFile size={15} />} accent={useColorModeValue("cyan.600", "#22D3EE")}>
                {form.uploadedDocuments.map((d, i) => (
                  <Flex key={i} px={4} py={1.5} align="center" gap={2} borderBottomWidth="1px" borderColor={bd} _last={{ borderBottom: "none" }}>
                    <IconFileText size={13} color={ac} />
                    <Text fontSize="xs" color={ac} fontWeight="medium" cursor="pointer" _hover={{ textDecoration: "underline" }}>{d}</Text>
                  </Flex>
                ))}
              </Section>
            )}
          </Flex>
        </SimpleGrid>

        {form.intermediarySwiftCode && (
          <Box mt={4}>
            <Section title="Intermediary Bank" icon={<IconBuildingBank size={15} />} accent={useColorModeValue("gray.500", "#9CA3AF")}>
              <SimpleGrid columns={3} px={4} py={2} gap={4}>
                <Box><Text fontSize="2xs" color={lb} fontWeight="medium">SWIFT</Text><Text fontSize="xs" color={vl} fontWeight="semibold">{form.intermediarySwiftCode}</Text></Box>
                <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Bank Name</Text><Text fontSize="xs" color={vl} fontWeight="semibold">{form.intermediaryBankName}</Text></Box>
                <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Country</Text><Text fontSize="xs" color={vl} fontWeight="semibold">{form.intermediaryCountry}</Text></Box>
              </SimpleGrid>
            </Section>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════
 *  D — Flat Sectioned (screenshot-faithful layout)
 * ══════════════════════════════════════════════════ */
function VariantD({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const lmBg = useColorModeValue("blue.50", dashColors.surfaceElevated);
  const sectionAccent = useColorModeValue("blue.500", "#3B82F6");
  const co = iftCountries.find((c) => c.code === form.orderingCountry);
  const bn = b ? bc(b.countryCode) : null;

  const SH = ({ t, icon, accent }: { t: string; icon?: React.ReactNode; accent?: string }) => (
    <Flex align="center" gap={2} mb={1.5} mt={3} _first={{ mt: 0 }}>
      {icon && <Box color={accent || sectionAccent}>{icon}</Box>}
      <Text fontSize="sm" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">{t}</Text>
      <Box flex={1} h="1px" bg={bd} />
    </Flex>
  );
  const F = ({ l, v, green }: { l: string; v: string; green?: boolean }) => (<Box><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize="xs" fontWeight="semibold" color={green ? "green.500" : vl} mt={0.5} noOfLines={1} wordBreak="break-all">{v || "—"}</Text></Box>);

  return (
    <Box>
      <RefBanner />
      <Box bg={cBg} borderWidth="1px" borderColor={bd} borderRadius="20px" p={4}>
        <SH t="Account Details" icon={<IconCreditCard size={14} />} />
        <SimpleGrid columns={{ base: 3, md: 6 }} gap={2} mb={1.5}>
          <F l="Debit Account Number" v={da?.accountNumber ?? ""} />
          <F l="Debit Account Name" v={da?.accountName ?? ""} />
          <F l="Available Balance" v={da ? `AED ${da.balance.toLocaleString()}` : ""} />
          <F l="Debit Account Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} />
          <F l="Overdraft Limit" v={`AED ${(da?.overdraftLimit ?? 0).toFixed(2)}`} />
          <F l="Frozen Amount" v={`AED ${(da?.frozenAmount ?? 0).toFixed(2)}`} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={2} mb={2}>
          <F l="Account Country" v={co ? `${co.flagEmoji} ${co.name}` : ""} />
          <F l="IBAN" v={da?.iban ?? ""} />
        </SimpleGrid>

        <SH t="Beneficiary Details" icon={<IconUser size={14} />} accent={useColorModeValue("purple.500", "#A78BFA")} />
        <SimpleGrid columns={{ base: 3, md: 5 }} gap={2} mb={1.5}>
          <F l="Beneficiary Nick Name" v={b?.nickName ?? ""} />
          <F l="Beneficiary Name" v={b?.name ?? ""} />
          <F l="Beneficiary Account Number" v={b?.accountNumber ?? ""} />
          <F l="Beneficiary Account Currency" v={bn ? `${bn.flag} ${bn.ccy}` : ""} />
          <F l="Beneficiary Bank Name" v={b?.bankName ?? ""} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 3, md: 5 }} gap={2} mb={2}>
          <F l="Beneficiary Bank Branch" v={b?.bankBranch ?? ""} />
          <F l="Bank Swift Code" v={b?.swiftCode ?? ""} />
          <F l="Beneficiary Bank Country" v={bn ? `${bn.flag} ${bn.name}` : ""} />
          <F l="Bank City" v={b?.bankCity ?? ""} />
          <F l="Verification Status" v={b?.verificationStatus ?? ""} green={b?.verificationStatus === "Verified"} />
        </SimpleGrid>

        <SH t="Payment Details" icon={<IconFileText size={14} />} accent={useColorModeValue("teal.500", "#2DD4BF")} />
        <SimpleGrid columns={{ base: 3, md: 6 }} gap={2} mb={1.5}>
          <F l="Payment Date" v={form.paymentDate} />
          <F l="Payment Amount" v={fa(form.paymentCurrency, form.paymentAmount)} />
          <F l="Debit Amount" v={fa(form.debitCurrency, form.debitAmount)} />
          <F l="FX Rate" v={fx(form.debitCurrency, form.paymentCurrency)} />
          <F l="Transfer Type" v={tt(form, b)} />
          <F l="Purpose of Payment" v={form.purposeOfPayment} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={2} mb={2}>
          <F l="Customer Reference" v={form.customerReference} />
          <F l="Beneficiary Purpose" v={form.beneficiaryPurpose} />
          <F l="Charge Type" v={form.chargeType} />
          <F l="Charge Account No." v={form.chargeAccountNumber} />
        </SimpleGrid>

        <Box bg={lmBg} borderRadius="lg" px={3} py={1.5} mb={2} borderWidth="1px" borderColor={useColorModeValue("blue.100", dashColors.cardBorder)}>
          <Flex gap={5} align="center" flexWrap="wrap">
            <Flex align="center" gap={1}><IconClock size={12} color="gray" /><Text fontSize="2xs" color={lb}>Cut-off Time</Text><Text fontSize="2xs" fontWeight="bold" color={vl}>{iftLimitsInfo.cutOffTime}</Text></Flex>
            <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>Available Limit</Text><Text fontSize="2xs" fontWeight="bold" color={ac}>{iftLimitsInfo.availableLimit}</Text></Flex>
            <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>Utilised Limit</Text><Text fontSize="2xs" fontWeight="bold" color={vl}>{iftLimitsInfo.utilisedLimit}</Text></Flex>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          {form.intermediarySwiftCode && <Box><SH t="Intermediary Bank" icon={<IconBuildingBank size={14} />} accent={useColorModeValue("gray.500", "#9CA3AF")} /><SimpleGrid columns={3} gap={2}><F l="SWIFT Code" v={form.intermediarySwiftCode} /><F l="Bank Name" v={form.intermediaryBankName} /><F l="Country" v={form.intermediaryCountry} /></SimpleGrid></Box>}
          {form.uploadedDocuments && form.uploadedDocuments.length > 0 && <Box><SH t="Uploaded Documents" icon={<IconFile size={14} />} accent={useColorModeValue("cyan.600", "#22D3EE")} /><Flex gap={3}>{form.uploadedDocuments.map((d, i) => <Flex key={i} align="center" gap={1}><IconFileText size={12} color="gray" /><Text fontSize="xs" color={ac} cursor="pointer" _hover={{ textDecoration: "underline" }}>{d}</Text></Flex>)}</Flex></Box>}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════
 *  E — Split Panel (From → To)
 * ══════════════════════════════════════════════════ */
function VariantE({ form, debitAccount: da, beneficiary: b }: VP) {
  const { dashColors } = useFabTokens();
  const cBg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("gray.200", dashColors.cardBorder);
  const lb = useColorModeValue("gray.500", dashColors.pageSubtitle);
  const vl = useColorModeValue("gray.800", dashColors.pageTitle);
  const ac = useColorModeValue("blue.600", "#60A5FA");
  const pBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const co = iftCountries.find((c) => c.code === form.orderingCountry);
  const bn = b ? bc(b.countryCode) : null;

  const F = ({ l, v, green, highlight }: { l: string; v: string; green?: boolean; highlight?: boolean }) => (
    <Flex justify="space-between" py={0.5} gap={2}><Text fontSize="2xs" color={lb} fontWeight="medium">{l}</Text><Text fontSize="xs" fontWeight="medium" color={green ? "green.500" : highlight ? ac : vl} textAlign="right" noOfLines={1}>{v || "—"}</Text></Flex>
  );

  return (
    <Box borderRadius="20px" overflow="hidden" borderWidth="1px" borderColor={bd}>
      {/* Hero with ref */}
      <Box bgGradient={useColorModeValue("linear(to-r, blue.500, blue.600)", "linear(to-r, rgba(0,98,255,0.3), rgba(0,98,255,0.15))")} px={4} py={2.5}>
        <Flex align="center" justify="space-between" gap={4}>
          <Box><Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Payment Amount</Text><Text fontSize="lg" fontWeight="bold" color="white">{fa(form.paymentCurrency, form.paymentAmount)}</Text></Box>
          <Flex align="center" gap={3}><Box textAlign="center"><Text fontSize="2xs" color="whiteAlpha.600">FX</Text><Text fontSize="2xs" fontWeight="bold" color="white">{fx(form.debitCurrency, form.paymentCurrency) || "1:1"}</Text></Box><IconArrowNarrowRight size={16} color="white" /></Flex>
          <Box textAlign="right"><Text fontSize="2xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider">Debit Amount</Text><Text fontSize="lg" fontWeight="bold" color="white">{fa(form.debitCurrency, form.debitAmount)}</Text></Box>
        </Flex>
        <Box mt={1.5}><RefBanner variant="hero" /></Box>
      </Box>

      {/* From / To panels */}
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Box bg={cBg} p={3} borderRightWidth={{ base: 0, md: "1px" }} borderColor={bd}>
          <HStack mb={1.5} pb={1} borderBottomWidth="1px" borderColor={bd}><IconCreditCard size={14} color={useColorModeValue("#3B82F6", "#60A5FA")} /><Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">From — Debit Account</Text></HStack>
          <F l="Account Number" v={da?.accountNumber ?? ""} /><F l="Account Name" v={da?.accountName ?? ""} /><F l="IBAN" v={da?.iban ?? ""} /><F l="Balance" v={da ? `AED ${da.balance.toLocaleString()}` : ""} highlight /><F l="Currency" v={`${currencyFlagMap[da?.currency ?? ""] ?? ""} ${da?.currency ?? ""}`} /><F l="Overdraft Limit" v={`AED ${(da?.overdraftLimit ?? 0).toFixed(2)}`} /><F l="Frozen Amount" v={`AED ${(da?.frozenAmount ?? 0).toFixed(2)}`} /><F l="Country" v={co ? `${co.flagEmoji} ${co.name}` : ""} />
        </Box>
        <Box bg={cBg} p={3}>
          <HStack mb={1.5} pb={1} borderBottomWidth="1px" borderColor={bd}><IconUser size={14} color={useColorModeValue("#8B5CF6", "#A78BFA")} /><Text fontSize="xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">To — Beneficiary</Text></HStack>
          <F l="Nick Name" v={b?.nickName ?? ""} /><F l="Name" v={b?.name ?? ""} /><F l="Account Number" v={b?.accountNumber ?? ""} /><F l="Currency" v={bn ? `${bn.flag} ${bn.ccy}` : ""} /><F l="Bank Name" v={b?.bankName ?? ""} /><F l="Branch" v={b?.bankBranch ?? ""} /><F l="SWIFT / BIC" v={b?.swiftCode ?? ""} /><F l="Country" v={bn ? `${bn.flag} ${bn.name}` : ""} /><F l="City" v={b?.bankCity ?? ""} />{b?.verificationStatus && <Flex justify="space-between" py={0.5}><Text fontSize="2xs" color={lb} fontWeight="medium">Verification</Text><Badge colorScheme={b.verificationStatus === "Verified" ? "green" : b.verificationStatus === "Pending" ? "yellow" : "red"} fontSize="2xs" borderRadius="md" px={2}>{b.verificationStatus}</Badge></Flex>}
        </Box>
      </SimpleGrid>

      {/* Payment details band */}
      <Box bg={pBg} px={4} py={2} borderTopWidth="1px" borderColor={bd}>
        <Flex align="center" gap={2} mb={1.5}><IconFileText size={13} color={useColorModeValue("#0D9488", "#2DD4BF")} /><Text fontSize="2xs" fontWeight="bold" color={vl} textTransform="uppercase" letterSpacing="wider">Payment Details</Text></Flex>
        <SimpleGrid columns={{ base: 3, md: 6 }} gap={2}>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Date</Text><Text fontSize="xs" fontWeight="semibold" color={vl}>{form.paymentDate}</Text></Box>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Type</Text><Text fontSize="xs" fontWeight="semibold" color={vl} noOfLines={1}>{tt(form, b)}</Text></Box>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Purpose</Text><Text fontSize="xs" fontWeight="semibold" color={vl} noOfLines={1}>{form.purposeOfPayment || "—"}</Text></Box>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Charges</Text><Text fontSize="xs" fontWeight="semibold" color={vl}>{form.chargeType || "—"}</Text></Box>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Customer Ref</Text><Text fontSize="xs" fontWeight="semibold" color={vl} noOfLines={1}>{form.customerReference || "—"}</Text></Box>
          <Box><Text fontSize="2xs" color={lb} fontWeight="medium">Charge Account</Text><Text fontSize="xs" fontWeight="semibold" color={vl}>{form.chargeAccountNumber || "—"}</Text></Box>
        </SimpleGrid>
      </Box>

      {/* Limits bar */}
      <Flex px={4} py={1.5} gap={4} flexWrap="wrap" borderTopWidth="1px" borderColor={bd} bg={cBg}>
        <Flex align="center" gap={1}><IconClock size={12} color="gray" /><Text fontSize="2xs" color={lb}>Cut-off</Text><Text fontSize="2xs" fontWeight="bold" color={vl}>{iftLimitsInfo.cutOffTime}</Text></Flex>
        <Text fontSize="2xs" color={lb}>|</Text>
        <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>Available</Text><Text fontSize="2xs" fontWeight="bold" color={ac}>{iftLimitsInfo.availableLimit}</Text></Flex>
        <Text fontSize="2xs" color={lb}>|</Text>
        <Flex align="center" gap={1}><Text fontSize="2xs" color={lb}>Utilised</Text><Text fontSize="2xs" fontWeight="bold" color={vl}>{iftLimitsInfo.utilisedLimit}</Text></Flex>
        {form.intermediarySwiftCode && <><Text fontSize="2xs" color={lb}>|</Text><Flex align="center" gap={1}><IconBuildingBank size={12} color="gray" /><Text fontSize="2xs" fontWeight="bold" color={vl}>{form.intermediarySwiftCode} · {form.intermediaryBankName}</Text></Flex></>}
      </Flex>

      {form.uploadedDocuments && form.uploadedDocuments.length > 0 && (
        <Flex px={4} py={1.5} gap={4} borderTopWidth="1px" borderColor={bd} bg={cBg} align="center">
          <IconFile size={12} color="gray" />
          {form.uploadedDocuments.map((d, i) => <Flex key={i} align="center" gap={1}><IconFileText size={12} /><Text fontSize="xs" color={ac} cursor="pointer" _hover={{ textDecoration: "underline" }}>{d}</Text></Flex>)}
        </Flex>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════════════════
 *  Main Page — 5 variant picker
 * ══════════════════════════════════════════════════ */
export function IftReviewSummaryPage(props: IftReviewSummaryPageProps) {
  const { form, debitAccount, beneficiary, summaryRows, onBack, onConfirm } = props;
  const [variant, setVariant] = useState<"A"|"B"|"C"|"D"|"E">("D");

  const { dashColors, dashGradients } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerBorderColor = useColorModeValue("#d7d7d7", dashColors.sectionDivider);
  const breadcrumbLink = useColorModeValue("accent.linkCta", "#60A5FA");
  const breadcrumbText = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const footerBg = useColorModeValue("white", dashColors.surfaceBase);
  const footerBorder = useColorModeValue("rgba(168,172,178,0.4)", dashColors.sectionDivider);
  const activeBg = useColorModeValue("blue.500", "#60A5FA");
  const inactiveBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const vp = { form, debitAccount, beneficiary, summaryRows };
  const VS: { key: typeof variant; label: string }[] = [
    { key: "A", label: "Grid" },{ key: "B", label: "Timeline" },{ key: "C", label: "Ledger" },{ key: "D", label: "Flat" },{ key: "E", label: "Split" },
  ];

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("transparent", dashColors.surfaceBase)} bgImage={useColorModeValue("none", dashGradients.canvas)}>
      <Box borderBottomWidth="1px" borderColor={headerBorderColor} px={{ base: 3, md: 6 }} py={2} position="sticky" top={0} zIndex={10}>
        <Flex align="center" gap={2}>
          <Box as="button" borderRadius="sm" p={1} display="flex" alignItems="center" cursor="pointer" color={labelColor} onClick={onBack}><IconChevronLeft size={16} /></Box>
          <Box>
            <HStack spacing={1} fontSize="2xs"><Text color={breadcrumbLink} cursor="pointer">Home</Text><Text color={breadcrumbText}>/</Text><Text color={breadcrumbLink} cursor="pointer">Payments</Text><Text color={breadcrumbText}>/</Text><Text color={breadcrumbLink} cursor="pointer" onClick={onBack}>New Transfer</Text><Text color={breadcrumbText}>/</Text><Text color={breadcrumbText}>Review</Text></HStack>
            <Text fontSize="md" fontWeight="medium" color={breadcrumbText} mt={0.5}>Review &amp; Confirm</Text>
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

      <Box flex={1} maxW="1200px" mx="auto" w="full" px={{ base: 3, md: 6 }} py={2}>
        {variant === "A" && <VariantA {...vp} />}
        {variant === "B" && <VariantB {...vp} />}
        {variant === "C" && <VariantC {...vp} />}
        {variant === "D" && <VariantD {...vp} />}
        {variant === "E" && <VariantE {...vp} />}
      </Box>

      <Box bg={footerBg} borderTopWidth="1px" borderColor={footerBorder} shadow="0px -2px 8px rgba(0,0,0,0.08)" px={{ base: 3, md: 6 }} py={2} position="sticky" bottom={0} zIndex={10}>
        <Flex justify="flex-end" gap={3} maxW="1200px" mx="auto">
          <Tooltip label="Download payment details" fontSize="xs" hasArrow><Button variant="ghost" color={useColorModeValue("gray.600", dashColors.pageSubtitle)} borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" leftIcon={<IconDownload size={14} />} _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }} onClick={() => { /* placeholder */ }}>Download</Button></Tooltip>
          <Button variant="outline" borderColor="accent.linkCta" color="accent.linkCta" borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" leftIcon={<IconArrowLeft size={14} />} _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }} onClick={onBack}>Edit</Button>
          <Button bg="accent.linkCta" color="white" borderRadius="sm" fontWeight="medium" fontSize="xs" size="sm" px={6} leftIcon={<IconCheck size={14} />} _hover={{ bg: "blue.600" }} onClick={onConfirm}>Submit</Button>
        </Flex>
      </Box>
      <AuthFooter />
    </Flex>
  );
}
