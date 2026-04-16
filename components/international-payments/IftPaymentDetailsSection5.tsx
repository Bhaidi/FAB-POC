"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconChevronDown,
  IconInfoCircle,
  IconLock,
  IconArrowNarrowRight,
  IconClock,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { currencyFlagMap, iftFxRates } from "@/data/iftPaymentMock";
import type { IftChargeOption, IftFormData, IftPurpose } from "@/data/iftPaymentTypes";

/* ── Props ─────────────────────────────────────── */

interface Props {
  form: IftFormData;
  purposes: IftPurpose[];
  beneficiaryPurposes: IftPurpose[];
  chargeOptions: IftChargeOption[];
  limitsInfo: {
    cutOffTime: string;
    availableLimit: string;
    utilisedLimit: string;
    fxRate: string;
  };
  onChange: (patch: Partial<IftFormData>) => void;
}

const CURRENCIES = ["EUR", "USD", "GBP", "AED"] as const;

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "yearly", label: "Yearly" },
];

function convertAmount(amount: string, from: string, to: string): string {
  if (!amount || from === to) return amount;
  const num = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(num)) return "";
  const rate = iftFxRates[from]?.[to];
  if (!rate) return "";
  return (num * rate).toFixed(2);
}

/* ── Countdown hook ────────────────────────────── */

function useCutoffCountdown(cutOffLabel: string) {
  // Parse "06:01 AM (14:00 CET)" → extract 24h "14:00"
  const target24h = useMemo(() => {
    const m = cutOffLabel.match(/\((\d{2}):(\d{2})/);
    if (m) return { h: parseInt(m[1], 10), m: parseInt(m[2], 10) };
    // fallback: parse "HH:MM AM/PM"
    const ampm = cutOffLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampm) {
      let h = parseInt(ampm[1], 10);
      const min = parseInt(ampm[2], 10);
      if (ampm[3].toUpperCase() === "PM" && h < 12) h += 12;
      if (ampm[3].toUpperCase() === "AM" && h === 12) h = 0;
      return { h, m: min };
    }
    return null;
  }, [cutOffLabel]);

  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!target24h) return;

    function calc() {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setHours(target24h!.h, target24h!.m, 0, 0);
      // If cutoff already passed today, show for tomorrow
      if (cutoff.getTime() <= now.getTime()) {
        cutoff.setDate(cutoff.getDate() + 1);
      }
      const diff = cutoff.getTime() - now.getTime();
      const hrs = Math.floor(diff / 3_600_000);
      const mins = Math.floor((diff % 3_600_000) / 60_000);
      const secs = Math.floor((diff % 60_000) / 1000);
      setRemaining(
        `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
      );
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target24h]);

  return remaining;
}

/* ── Component ─────────────────────────────────── */

/**
 * Payment Details — Option 5 (Best UX)
 *
 * Improvements over Option 4:
 *  - Segmented type toggle in context strip with IFT/Domestic badge on the RIGHT
 *  - Date row adapts: one-time → single date; recurring → first date + frequency + count + last date
 *  - Amount hero card with FIXED currency selects (no clipping), larger font
 *  - FX ribbon with "(Indicative)" label
 *  - Real-time countdown timer for cut-off in the limits bar
 *  - Progressive charge chips — only active description shown
 */
export function IftPaymentDetailsSection5({
  form,
  purposes,
  beneficiaryPurposes,
  chargeOptions,
  limitsInfo,
  onChange,
}: Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const stripBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const segBg = useColorModeValue("gray.200", dashColors.surfaceBase);
  const segActiveBg = useColorModeValue("white", dashColors.cardBg);

  const iftBg = useColorModeValue("orange.50", "rgba(251,146,60,0.14)");
  const iftColor = useColorModeValue("orange.600", "orange.300");
  const domesticBg = useColorModeValue("green.50", "rgba(34,197,94,0.14)");
  const domesticColor = useColorModeValue("green.600", "green.300");

  const amtCardBorder = useColorModeValue("blue.100", dashColors.cardBorder);
  const fxRibbonBg = useColorModeValue("blue.50", "rgba(59,130,246,0.1)");

  const limitBg = useColorModeValue("blue.50", dashColors.surfaceElevated);
  const limitBorder = useColorModeValue("blue.100", dashColors.cardBorder);
  const timerColor = useColorModeValue("orange.600", "orange.300");

  const paymentIsReadOnly = form.lastEditedAmountField === "debit" && !!form.debitAmount;
  const debitIsReadOnly = form.lastEditedAmountField === "payment" && !!form.paymentAmount;
  const isCrossCurrency = form.paymentCurrency !== form.debitCurrency;
  const isRecurring = form.paymentType === "recurring";

  const countdown = useCutoffCountdown(limitsInfo.cutOffTime);

  const autoConvert = useCallback(() => {
    if (form.lastEditedAmountField === "payment" && form.paymentAmount) {
      const c = convertAmount(form.paymentAmount, form.paymentCurrency, form.debitCurrency);
      if (c !== form.debitAmount) onChange({ debitAmount: c });
    } else if (form.lastEditedAmountField === "debit" && form.debitAmount) {
      const c = convertAmount(form.debitAmount, form.debitCurrency, form.paymentCurrency);
      if (c !== form.paymentAmount) onChange({ paymentAmount: c });
    }
  }, [form.paymentAmount, form.debitAmount, form.paymentCurrency, form.debitCurrency, form.lastEditedAmountField, onChange]);

  useEffect(() => {
    autoConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.paymentCurrency, form.debitCurrency]);

  const fxRate = iftFxRates[form.paymentCurrency]?.[form.debitCurrency];

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" w="full" overflow="hidden">

      {/* ═══ 1. Context strip — type toggle + IFT badge ═══ */}
      <Flex
        bg={stripBg}
        px={5}
        py={2.5}
        align="center"
        gap={3}
        borderBottomWidth="1px"
        borderColor={borderColor}
        flexWrap="wrap"
      >
        {/* Segmented toggle */}
        <Flex bg={segBg} borderRadius="md" p={0.5} flexShrink={0}>
          {(["one-time", "recurring"] as const).map((type) => (
            <Box
              key={type}
              as="button"
              px={4}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="semibold"
              bg={form.paymentType === type ? segActiveBg : "transparent"}
              color={form.paymentType === type ? labelColor : hintColor}
              shadow={form.paymentType === type ? "sm" : "none"}
              onClick={() => onChange({ paymentType: type })}
              transition="all 0.15s"
              whiteSpace="nowrap"
            >
              {type === "one-time" ? "One-time Payment" : "Recurring Payment"}
            </Box>
          ))}
        </Flex>

        {/* Spacer pushes badge right */}
        <Box flex={1} />

        {/* IFT / Domestic badge — right side for visibility */}
        <Badge
          px={2.5}
          py={0.5}
          borderRadius="full"
          fontSize="2xs"
          fontWeight="bold"
          bg={isCrossCurrency ? iftBg : domesticBg}
          color={isCrossCurrency ? iftColor : domesticColor}
          letterSpacing="0.02em"
        >
          {isCrossCurrency
            ? "IFT · Cross-currency detected"
            : "Domestic Fund Transfer"}
        </Badge>
      </Flex>

      {/* ═══ Body ═══ */}
      <Flex direction="column" gap={3} px={5} py={4}>

        {/* ═══ 2. Date section — adaptive ═══ */}
        {!isRecurring ? (
          /* One-time: single date */
          <FormControl maxW={{ base: "full", md: "220px" }}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Payment Date <Text as="span" color="red.600">*</Text>
            </FormLabel>
            <Box
              onClick={() => {
                const el = document.getElementById("ift-pd5-date") as HTMLInputElement | null;
                el?.showPicker?.();
                el?.focus();
              }}
              cursor="pointer"
            >
              <Input
                id="ift-pd5-date"
                type="date"
                value={form.paymentDate}
                onChange={(e) => onChange({ paymentDate: e.target.value })}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="sm"
                h="38px"
                borderRadius="4px"
                cursor="pointer"
              />
            </Box>
          </FormControl>
        ) : (
          /* Recurring: 3-col top + last date below */
          <Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
                  First Payment Date <Text as="span" color="red.600">*</Text>
                </FormLabel>
                <Box
                  onClick={() => {
                    const el = document.getElementById("ift-pd5-first") as HTMLInputElement | null;
                    el?.showPicker?.();
                    el?.focus();
                  }}
                  cursor="pointer"
                >
                  <Input
                    id="ift-pd5-first"
                    type="date"
                    value={form.firstPaymentDate}
                    onChange={(e) => onChange({ firstPaymentDate: e.target.value })}
                    placeholder="Select First Payment Date"
                    bg={fieldBg}
                    borderColor={borderColor}
                    color={labelColor}
                    fontSize="sm"
                    h="38px"
                    borderRadius="4px"
                    cursor="pointer"
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
                  Execution Frequency <Text as="span" color="red.600">*</Text>
                </FormLabel>
                <Select
                  placeholder="Select Execution Frequency"
                  value={form.executionFrequency}
                  onChange={(e) => onChange({ executionFrequency: e.target.value })}
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="sm"
                  h="38px"
                  borderRadius="4px"
                  icon={<IconChevronDown size={16} />}
                >
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
                  Number Of Payments <Text as="span" color="red.600">*</Text>
                </FormLabel>
                <Input
                  type="number"
                  min={1}
                  value={form.numberOfPayments}
                  onChange={(e) => onChange({ numberOfPayments: e.target.value })}
                  placeholder="Enter No. Of Payments"
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="sm"
                  h="38px"
                  borderRadius="4px"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl mt={3} maxW={{ base: "full", md: "33.33%" }}>
              <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
                Last Payment Date <Text as="span" color="red.600">*</Text>
              </FormLabel>
              <Box
                onClick={() => {
                  const el = document.getElementById("ift-pd5-last") as HTMLInputElement | null;
                  el?.showPicker?.();
                  el?.focus();
                }}
                cursor="pointer"
              >
                <Input
                  id="ift-pd5-last"
                  type="date"
                  value={form.lastPaymentDate}
                  onChange={(e) => onChange({ lastPaymentDate: e.target.value })}
                  placeholder="Select Last Payment Date"
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="sm"
                  h="38px"
                  borderRadius="4px"
                  cursor="pointer"
                />
              </Box>
            </FormControl>
          </Box>
        )}

        {/* ═══ 3. Amount hero card ═══ */}
        <Box
          borderWidth="1px"
          borderColor={amtCardBorder}
          borderRadius="lg"
          overflow="visible"
        >
          <Flex direction={{ base: "column", md: "row" }}>
            {/* Send side */}
            <Box flex={1} p={3}>
              <Text fontSize="2xs" fontWeight="medium" color={hintColor} mb={1}>
                Payment Amount
              </Text>
              <Flex>
                <Select
                  value={form.paymentCurrency}
                  onChange={(e) => onChange({ paymentCurrency: e.target.value })}
                  w="92px"
                  flexShrink={0}
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="44px"
                  borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
                  zIndex={2}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{currencyFlagMap[c]} {c}</option>
                  ))}
                </Select>
                <InputGroup flex={1}>
                  <Input
                    value={form.paymentAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const conv = convertAmount(val, form.paymentCurrency, form.debitCurrency);
                      onChange({ paymentAmount: val, lastEditedAmountField: "payment", debitAmount: conv });
                    }}
                    placeholder="0.00"
                    bg={paymentIsReadOnly ? readOnlyBg : fieldBg}
                    borderColor={borderColor}
                    color={labelColor}
                    fontSize="xl"
                    fontWeight="bold"
                    h="44px"
                    borderLeftRadius={0}
                    borderLeftWidth={0}
                    isReadOnly={paymentIsReadOnly}
                    opacity={paymentIsReadOnly ? 0.7 : 1}
                  />
                  {paymentIsReadOnly && (
                    <InputRightElement h="44px"><IconLock size={14} color="gray" /></InputRightElement>
                  )}
                </InputGroup>
              </Flex>
            </Box>

            {/* FX ribbon */}
            <Flex
              bg={fxRibbonBg}
              align="center"
              justify="center"
              px={3}
              py={{ base: 2, md: 0 }}
              minW={{ md: "130px" }}
              direction={{ base: "row", md: "column" }}
              gap={0.5}
            >
              <IconArrowNarrowRight size={16} color="gray" />
              {isCrossCurrency && fxRate ? (
                <>
                  <Text fontSize="2xs" color={labelColor} fontWeight="semibold" textAlign="center" whiteSpace="nowrap">
                    1 {form.paymentCurrency} = {fxRate} {form.debitCurrency}
                  </Text>
                  <Text fontSize="2xs" color={hintColor} fontStyle="italic">
                    (Indicative)
                  </Text>
                </>
              ) : (
                <Text fontSize="2xs" color={hintColor}>Same currency</Text>
              )}
            </Flex>

            {/* Receive side */}
            <Box flex={1} p={3}>
              <Text fontSize="2xs" fontWeight="medium" color={hintColor} mb={1}>
                Debit Amount
              </Text>
              <Flex>
                <Select
                  value={form.debitCurrency}
                  onChange={(e) => onChange({ debitCurrency: e.target.value })}
                  w="92px"
                  flexShrink={0}
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="44px"
                  borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
                  zIndex={2}
                  isDisabled
                  opacity={0.8}
                  cursor="not-allowed"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{currencyFlagMap[c]} {c}</option>
                  ))}
                </Select>
                <InputGroup flex={1}>
                  <Input
                    value={form.debitAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const conv = convertAmount(val, form.debitCurrency, form.paymentCurrency);
                      onChange({ debitAmount: val, lastEditedAmountField: "debit", paymentAmount: conv });
                    }}
                    placeholder="0.00"
                    bg={debitIsReadOnly ? readOnlyBg : fieldBg}
                    borderColor={borderColor}
                    color={labelColor}
                    fontSize="xl"
                    fontWeight="bold"
                    h="44px"
                    borderLeftRadius={0}
                    borderLeftWidth={0}
                    isReadOnly={debitIsReadOnly}
                    opacity={debitIsReadOnly ? 0.7 : 1}
                  />
                  {debitIsReadOnly && (
                    <InputRightElement h="44px"><IconLock size={14} color="gray" /></InputRightElement>
                  )}
                </InputGroup>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* ═══ 4. Limits bar with countdown ═══ */}
        <Flex
          bg={limitBg}
          borderWidth="1px"
          borderColor={limitBorder}
          borderRadius="md"
          px={3}
          py={2}
          gap={4}
          fontSize="2xs"
          color={hintColor}
          flexWrap="wrap"
          align="center"
        >
          {/* Countdown */}
          <Flex align="center" gap={1.5} flexShrink={0}>
            <IconClock size={14} color="currentColor" />
            <Text fontSize="2xs" color={hintColor}>Cut-off</Text>
            <Text fontSize="2xs" fontWeight="bold" color={labelColor}>
              {limitsInfo.cutOffTime}
            </Text>
            {countdown && (
              <Badge
                ml={1}
                px={1.5}
                py={0}
                borderRadius="sm"
                fontSize="2xs"
                fontFamily="mono"
                fontWeight="bold"
                colorScheme="orange"
                variant="subtle"
                color={timerColor}
              >
                {countdown}
              </Badge>
            )}
          </Flex>

          <Box w="1px" h="14px" bg={borderColor} display={{ base: "none", md: "block" }} />

          <Flex align="center" gap={1}>
            <Text fontSize="2xs" color={hintColor}>Available</Text>
            <Text fontSize="2xs" fontWeight="bold" color={labelColor}>
              {limitsInfo.availableLimit}
            </Text>
          </Flex>

          <Box w="1px" h="14px" bg={borderColor} display={{ base: "none", md: "block" }} />

          <Flex align="center" gap={1}>
            <Text fontSize="2xs" color={hintColor}>Utilised</Text>
            <Text fontSize="2xs" fontWeight="bold" color={labelColor}>
              {limitsInfo.utilisedLimit}
            </Text>
          </Flex>
        </Flex>

        {/* ═══ 5. FX Transfer Reference ═══ */}
        <Box
          borderWidth="1px"
          borderColor={form.fxReferenceEnabled ? "accent.linkCta" : borderColor}
          borderRadius="lg"
          bg={form.fxReferenceEnabled ? useColorModeValue("blue.50", "rgba(0, 98, 255, 0.08)") : "transparent"}
          px={4}
          py={3}
          transition="all 0.15s"
        >
          <Flex align="center" gap={3} flexWrap="wrap">
            <Checkbox
              isChecked={form.fxReferenceEnabled}
              onChange={(e) => {
                onChange({
                  fxReferenceEnabled: e.target.checked,
                  ...(!e.target.checked ? { fxReferenceNumber: "" } : {}),
                });
              }}
              colorScheme="blue"
              size="sm"
            >
              <Flex align="center" gap={2}>
                <Text fontSize="xs" fontWeight="medium" color={labelColor}>
                  FX Transfer Reference
                </Text>
                {!form.fxReferenceEnabled && (
                  <Badge
                    fontSize="2xs"
                    variant="subtle"
                    colorScheme="blue"
                    borderRadius="full"
                    px={2}
                    fontWeight="normal"
                  >
                    Optional
                  </Badge>
                )}
              </Flex>
            </Checkbox>

            {form.fxReferenceEnabled ? (
              <FormControl maxW="260px" flexShrink={0}>
                <Input
                  value={form.fxReferenceNumber}
                  onChange={(e) => onChange({ fxReferenceNumber: e.target.value })}
                  placeholder="e.g. FX-2026-0417-001"
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="38px"
                  borderRadius="4px"
                  _placeholder={{ color: hintColor }}
                />
              </FormControl>
            ) : (
              <IconInfoCircle size={14} color="gray" />
            )}
          </Flex>

          {!form.fxReferenceEnabled && (
            <Text fontSize="2xs" color={hintColor} mt={1} ml={6}>
              Enable to link a pre-agreed FX deal to this transfer
            </Text>
          )}
        </Box>

        {/* ═══ 6. Charge Type — radio cards (Option 2 style) ═══ */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
            Charge Type <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <RadioGroup value={form.chargeType} onChange={(val) => onChange({ chargeType: val })}>
            <Flex gap={2} flexWrap="wrap">
              {chargeOptions.map((opt) => (
                <Box
                  key={opt.value}
                  borderWidth="1px"
                  borderColor={form.chargeType === opt.value ? "accent.linkCta" : borderColor}
                  borderRadius="4px"
                  px={3}
                  py={2}
                  cursor="pointer"
                  onClick={() => onChange({ chargeType: opt.value })}
                  flex="1"
                  minW="120px"
                >
                  <Radio value={opt.value} colorScheme="blue" size="sm">
                    <Text fontSize="xs" fontWeight="semibold" color={labelColor}>{opt.label}</Text>
                  </Radio>
                  <Text fontSize="2xs" color={hintColor} mt={0.5} ml={5}>{opt.description}</Text>
                </Box>
              ))}
            </Flex>
          </RadioGroup>
        </FormControl>

        {/* Charge Account — conditional */}
        {(form.chargeType === "OUR" || form.chargeType === "SHA") && (
          <FormControl maxW={{ base: "full", md: "260px" }}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Charge Account No. <Text as="span" color="red.600">*</Text>
            </FormLabel>
            <Select
              value={form.chargeAccountNumber}
              onChange={(e) => onChange({ chargeAccountNumber: e.target.value })}
              placeholder="Select"
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="38px"
              borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              <option value="4451000040007851">4451000040007851</option>
              <option value="4451000040033488">4451000040033488</option>
              <option value="4451000040008923">4451000040008923</option>
            </Select>
          </FormControl>
        )}

        {/* ═══ 7. Purpose / Ref / Bene ═══ */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Purpose of Payment
            </FormLabel>
            <Select
              placeholder="Select"
              value={form.purposeOfPayment}
              onChange={(e) => onChange({ purposeOfPayment: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="38px"
              borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              {purposes.map((p) => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Customer Reference
            </FormLabel>
            <Input
              value={form.customerReference}
              onChange={(e) => onChange({ customerReference: e.target.value })}
              placeholder="Enter"
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="38px"
              borderRadius="4px"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Beneficiary Purpose
            </FormLabel>
            <Select
              placeholder="Select"
              value={form.beneficiaryPurpose}
              onChange={(e) => onChange({ beneficiaryPurpose: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="38px"
              borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              {beneficiaryPurposes.map((p) => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        {/* Payment Details */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
            Payment Details <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Textarea
            value={form.paymentDetails}
            onChange={(e) => {
              if (e.target.value.length <= 140) onChange({ paymentDetails: e.target.value });
            }}
            placeholder="Enter payment details"
            bg={fieldBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            borderRadius="4px"
            rows={2}
          />
          <Flex justify="space-between" mt={0.5}>
            <Text fontSize="2xs" color={hintColor}>Special chars: / - ? : ( ) . , &apos;</Text>
            <Text fontSize="2xs" color={hintColor}>{form.paymentDetails.length}/140</Text>
          </Flex>
        </FormControl>
      </Flex>
    </Box>
  );
}
