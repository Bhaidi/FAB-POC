"use client";

import { useCallback, useEffect } from "react";
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
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { currencyFlagMap, iftFxRates } from "@/data/iftPaymentMock";
import type { IftChargeOption, IftFormData, IftPurpose } from "@/data/iftPaymentTypes";

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

function convertAmount(amount: string, from: string, to: string): string {
  if (!amount || from === to) return amount;
  const num = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(num)) return "";
  const rate = iftFxRates[from]?.[to];
  if (!rate) return "";
  return (num * rate).toFixed(2);
}

/**
 * Payment Details — Option 4 (Recommended)
 *
 * Design rationale — built from best UX patterns in banking transfer forms:
 *
 *  1. **Context strip** — a tinted header bar that puts payment type (segmented),
 *     IFT/Domestic badge, and date (one-time only) on ONE horizontal line.
 *     Users see the full transfer context before touching any field.
 *
 *  2. **Amount hero card** — amounts are the #1 element users care about, so they
 *     get a bordered card with "Send" / "Receive" labels and a live FX rate
 *     ribbon between them. The visual weight draws the eye here first.
 *
 *  3. **Inline limits** — cut-off + available limit shown as a subtle tinted bar
 *     right below amounts so users know constraints immediately.
 *
 *  4. **Flat charge chips** — charge type shown as minimal clickable chips in a
 *     single row (no radio circles, no description until selected).
 *     Description appears only for the active chip → progressive disclosure.
 *
 *  5. **Collapsed extras** — purpose, reference, bene purpose, payment details
 *     and FX reference grouped at the bottom in compact rows. Most users
 *     accept defaults here, so it doesn't need to dominate.
 */
export function IftPaymentDetailsSection4({
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

  // Context strip
  const stripBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const segBg = useColorModeValue("gray.200", dashColors.surfaceElevated);
  const segActiveBg = useColorModeValue("white", dashColors.cardBg);

  // Badges
  const iftBg = useColorModeValue("orange.50", "rgba(251,146,60,0.14)");
  const iftColor = useColorModeValue("orange.600", "orange.300");
  const domesticBg = useColorModeValue("green.50", "rgba(34,197,94,0.14)");
  const domesticColor = useColorModeValue("green.600", "green.300");

  // Amount card
  const amtCardBg = useColorModeValue("white", dashColors.surfaceElevated);
  const amtCardBorder = useColorModeValue("blue.100", dashColors.cardBorder);
  const fxRibbonBg = useColorModeValue("blue.50", "rgba(59,130,246,0.1)");

  // Limits
  const limitBg = useColorModeValue("blue.50", dashColors.surfaceElevated);
  const limitBorder = useColorModeValue("blue.100", dashColors.cardBorder);

  // Charge chips
  const chipBorder = useColorModeValue("gray.200", dashColors.cardBorder);
  const chipActiveBg = useColorModeValue("accent.linkCta", "#3B82F6");

  const paymentIsReadOnly = form.lastEditedAmountField === "debit" && !!form.debitAmount;
  const debitIsReadOnly = form.lastEditedAmountField === "payment" && !!form.paymentAmount;
  const isCrossCurrency = form.paymentCurrency !== form.debitCurrency;

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
  const activeCharge = chargeOptions.find((o) => o.value === form.chargeType);

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" w="full" overflow="hidden">
      {/* ═══ 1. Context strip ═══ */}
      <Flex
        bg={stripBg}
        px={5}
        py={2.5}
        align="center"
        gap={3}
        flexWrap="wrap"
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        {/* Segmented payment type */}
        <Flex bg={segBg} borderRadius="md" p={0.5} gap={0} flexShrink={0}>
          {(["one-time", "recurring"] as const).map((type) => (
            <Box
              key={type}
              as="button"
              px={3.5}
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
              {type === "one-time" ? "One-time" : "Recurring"}
            </Box>
          ))}
        </Flex>

        {/* IFT / Domestic badge */}
        <Badge
          px={2}
          py={0.5}
          borderRadius="full"
          fontSize="2xs"
          fontWeight="bold"
          bg={isCrossCurrency ? iftBg : domesticBg}
          color={isCrossCurrency ? iftColor : domesticColor}
          letterSpacing="0.02em"
        >
          {isCrossCurrency ? "IFT · Cross-currency" : "Domestic Transfer"}
        </Badge>

        {/* Date — one-time only, pushed right */}
        {form.paymentType === "one-time" && (
          <Box
            ml="auto"
            onClick={() => {
              const el = document.getElementById("ift-pd4-date") as HTMLInputElement | null;
              el?.showPicker?.();
              el?.focus();
            }}
            cursor="pointer"
          >
            <Input
              id="ift-pd4-date"
              type="date"
              value={form.paymentDate}
              onChange={(e) => onChange({ paymentDate: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="30px"
              w="150px"
              borderRadius="4px"
              cursor="pointer"
            />
          </Box>
        )}
      </Flex>

      {/* ═══ Body ═══ */}
      <Flex direction="column" gap={3} px={5} py={4}>

        {/* ═══ 2. Amount hero card ═══ */}
        <Box
          borderWidth="1px"
          borderColor={amtCardBorder}
          borderRadius="lg"
          overflow="hidden"
        >
          <Flex direction={{ base: "column", md: "row" }}>
            {/* Send side */}
            <Box flex={1} p={3}>
              <Text fontSize="2xs" fontWeight="medium" color={hintColor} mb={1}>
                Send
              </Text>
              <Flex>
                <Select
                  value={form.paymentCurrency}
                  onChange={(e) => onChange({ paymentCurrency: e.target.value })}
                  w="88px"
                  flexShrink={0}
                  bg={amtCardBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="40px"
                  borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
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
                    bg={paymentIsReadOnly ? readOnlyBg : amtCardBg}
                    borderColor={borderColor}
                    color={labelColor}
                    fontSize="lg"
                    fontWeight="semibold"
                    h="40px"
                    borderLeftRadius={0}
                    borderLeftWidth={0}
                    isReadOnly={paymentIsReadOnly}
                    opacity={paymentIsReadOnly ? 0.7 : 1}
                  />
                  {paymentIsReadOnly && (
                    <InputRightElement h="40px"><IconLock size={14} color="gray" /></InputRightElement>
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
              py={{ base: 1.5, md: 0 }}
              minW={{ md: "120px" }}
              direction={{ base: "row", md: "column" }}
              gap={1}
            >
              <IconArrowNarrowRight size={16} color="gray" style={{ transform: "rotate(0deg)" }} />
              {isCrossCurrency && fxRate ? (
                <Text fontSize="2xs" color={hintColor} fontWeight="medium" textAlign="center" whiteSpace="nowrap">
                  1 {form.paymentCurrency} = {fxRate} {form.debitCurrency}
                </Text>
              ) : (
                <Text fontSize="2xs" color={hintColor}>No FX</Text>
              )}
            </Flex>

            {/* Receive side */}
            <Box flex={1} p={3}>
              <Text fontSize="2xs" fontWeight="medium" color={hintColor} mb={1}>
                Receive (Debit)
              </Text>
              <Flex>
                <Select
                  value={form.debitCurrency}
                  onChange={(e) => onChange({ debitCurrency: e.target.value })}
                  w="88px"
                  flexShrink={0}
                  bg={amtCardBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="40px"
                  borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
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
                    bg={debitIsReadOnly ? readOnlyBg : amtCardBg}
                    borderColor={borderColor}
                    color={labelColor}
                    fontSize="lg"
                    fontWeight="semibold"
                    h="40px"
                    borderLeftRadius={0}
                    borderLeftWidth={0}
                    isReadOnly={debitIsReadOnly}
                    opacity={debitIsReadOnly ? 0.7 : 1}
                  />
                  {debitIsReadOnly && (
                    <InputRightElement h="40px"><IconLock size={14} color="gray" /></InputRightElement>
                  )}
                </InputGroup>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* ═══ 3. Inline limits ═══ */}
        <Flex
          bg={limitBg}
          borderWidth="1px"
          borderColor={limitBorder}
          borderRadius="sm"
          px={3}
          py={1.5}
          gap={5}
          fontSize="2xs"
          color={hintColor}
          flexWrap="wrap"
          align="center"
        >
          <Text>
            Cut-off{" "}
            <Text as="span" fontWeight="semibold" color={labelColor}>
              {limitsInfo.cutOffTime}
            </Text>
          </Text>
          <Box w="1px" h="12px" bg={borderColor} display={{ base: "none", md: "block" }} />
          <Text>
            Available{" "}
            <Text as="span" fontWeight="semibold" color={labelColor}>
              {limitsInfo.availableLimit}
            </Text>
          </Text>
          <Box w="1px" h="12px" bg={borderColor} display={{ base: "none", md: "block" }} />
          <Text>
            Utilised{" "}
            <Text as="span" fontWeight="semibold" color={labelColor}>
              {limitsInfo.utilisedLimit}
            </Text>
          </Text>
        </Flex>

        {/* ═══ 4. Flat charge chips ═══ */}
        <Box>
          <Text fontSize="xs" fontWeight="medium" color={labelColor} mb={1.5}>
            Charge Type <Text as="span" color="red.600">*</Text>
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {chargeOptions.map((opt) => (
              <Box
                key={opt.value}
                as="button"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
                bg={form.chargeType === opt.value ? chipActiveBg : "transparent"}
                color={form.chargeType === opt.value ? "white" : labelColor}
                borderWidth="1px"
                borderColor={form.chargeType === opt.value ? chipActiveBg : chipBorder}
                onClick={() => onChange({ chargeType: opt.value })}
                transition="all 0.15s"
                _hover={{ borderColor: "accent.linkCta" }}
              >
                {opt.label}
              </Box>
            ))}
          </Flex>
          {/* Active charge description — progressive disclosure */}
          {activeCharge && (
            <Text fontSize="2xs" color={hintColor} mt={1}>
              {activeCharge.description}
            </Text>
          )}
        </Box>

        {/* Charge Account — conditional */}
        {(form.chargeType === "OUR" || form.chargeType === "SHA") && (
          <FormControl maxW={{ base: "full", md: "260px" }}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Charge Account <Text as="span" color="red.600">*</Text>
            </FormLabel>
            <Select
              value={form.chargeAccountNumber}
              onChange={(e) => onChange({ chargeAccountNumber: e.target.value })}
              placeholder="Select"
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="xs"
              h="36px"
              borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              <option value="4451000040007851">4451000040007851</option>
              <option value="4451000040033488">4451000040033488</option>
              <option value="4451000040008923">4451000040008923</option>
            </Select>
          </FormControl>
        )}

        {/* ═══ 5. Purpose / Ref / Bene — compact row ═══ */}
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
              h="36px"
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
              h="36px"
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
              h="36px"
              borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              {beneficiaryPurposes.map((p) => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        {/* Payment Details + FX ref on same row */}
        <Flex gap={3} direction={{ base: "column", md: "row" }} align="start">
          <FormControl flex={1}>
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
              <Text fontSize="2xs" color={hintColor}>/ - ? : ( ) . , &apos;</Text>
              <Text fontSize="2xs" color={hintColor}>{form.paymentDetails.length}/140</Text>
            </Flex>
          </FormControl>
          <Box pt={6} flexShrink={0}>
            <Checkbox
              isChecked={form.fxReferenceEnabled}
              onChange={(e) => onChange({ fxReferenceEnabled: e.target.checked })}
              colorScheme="blue"
              size="sm"
            >
              <Flex align="center" gap={1}>
                <Text fontSize="xs" color={labelColor} whiteSpace="nowrap">FX Reference</Text>
                <IconInfoCircle size={13} color="gray" />
              </Flex>
            </Checkbox>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
