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
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconCalendar,
  IconChevronDown,
  IconInfoCircle,
  IconLock,
  IconArrowsExchange,
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
 * Payment Details — Option 2
 * Compact layout: payment type as inline toggle pills,
 * date only for one-time, amounts side-by-side with IFT indicator,
 * limits as a single condensed line.
 */
export function IftPaymentDetailsSection2({
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
  const infoBg = useColorModeValue("blue.50", dashColors.surfaceElevated);
  const infoBorder = useColorModeValue("blue.100", dashColors.cardBorder);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);
  const iftBadgeBg = useColorModeValue("orange.50", "rgba(251,146,60,0.15)");
  const iftBadgeColor = useColorModeValue("orange.700", "orange.300");
  const domesticBadgeBg = useColorModeValue("green.50", "rgba(34,197,94,0.15)");
  const domesticBadgeColor = useColorModeValue("green.700", "green.300");

  const paymentIsReadOnly = form.lastEditedAmountField === "debit" && !!form.debitAmount;
  const debitIsReadOnly = form.lastEditedAmountField === "payment" && !!form.paymentAmount;
  const isCrossCurrency = form.paymentCurrency !== form.debitCurrency;

  const autoConvert = useCallback(() => {
    if (form.lastEditedAmountField === "payment" && form.paymentAmount) {
      const converted = convertAmount(form.paymentAmount, form.paymentCurrency, form.debitCurrency);
      if (converted !== form.debitAmount) onChange({ debitAmount: converted });
    } else if (form.lastEditedAmountField === "debit" && form.debitAmount) {
      const converted = convertAmount(form.debitAmount, form.debitCurrency, form.paymentCurrency);
      if (converted !== form.paymentAmount) onChange({ paymentAmount: converted });
    }
  }, [form.paymentAmount, form.debitAmount, form.paymentCurrency, form.debitCurrency, form.lastEditedAmountField, onChange]);

  useEffect(() => {
    autoConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.paymentCurrency, form.debitCurrency]);

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" px={5} py={4} w="full">
      <Flex direction="column" gap={3}>

        {/* Row 1: Payment type pills + IFT badge + date (one-time only) */}
        <Flex align="center" gap={3} flexWrap="wrap">
          {/* Pill toggle */}
          <Flex
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="full"
            overflow="hidden"
            h="34px"
            flexShrink={0}
          >
            <Box
              as="button"
              px={4}
              fontSize="xs"
              fontWeight="semibold"
              bg={form.paymentType === "one-time" ? "accent.linkCta" : "transparent"}
              color={form.paymentType === "one-time" ? "white" : labelColor}
              _hover={{ opacity: 0.85 }}
              transition="all 0.15s"
              onClick={() => onChange({ paymentType: "one-time" })}
            >
              One-time
            </Box>
            <Box
              as="button"
              px={4}
              fontSize="xs"
              fontWeight="semibold"
              bg={form.paymentType === "recurring" ? "accent.linkCta" : "transparent"}
              color={form.paymentType === "recurring" ? "white" : labelColor}
              _hover={{ opacity: 0.85 }}
              transition="all 0.15s"
              onClick={() => onChange({ paymentType: "recurring" })}
            >
              Recurring
            </Box>
          </Flex>

          {/* IFT / Domestic Badge */}
          <Badge
            px={2.5}
            py={0.5}
            borderRadius="full"
            fontSize="2xs"
            fontWeight="semibold"
            bg={isCrossCurrency ? iftBadgeBg : domesticBadgeBg}
            color={isCrossCurrency ? iftBadgeColor : domesticBadgeColor}
          >
            {isCrossCurrency ? "IFT · Cross-currency" : "Domestic · Same currency"}
          </Badge>

          {/* Payment date — only for one-time */}
          {form.paymentType === "one-time" && (
            <FormControl maxW="180px" ml="auto">
              <Box
                position="relative"
                onClick={() => {
                  const el = document.getElementById("ift-pd2-date") as HTMLInputElement | null;
                  el?.showPicker?.();
                  el?.focus();
                }}
                cursor="pointer"
              >
                <Input
                  id="ift-pd2-date"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => onChange({ paymentDate: e.target.value })}
                  bg={fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="xs"
                  h="34px"
                  borderRadius="4px"
                  cursor="pointer"
                />
              </Box>
            </FormControl>
          )}
        </Flex>

        {/* Limits — compact single line */}
        <Flex
          bg={infoBg}
          borderWidth="1px"
          borderColor={infoBorder}
          borderRadius="sm"
          px={3}
          py={2}
          gap={4}
          align="center"
          fontSize="2xs"
          color={hintColor}
          flexWrap="wrap"
        >
          <Text>Cut-off: <Text as="span" fontWeight="semibold" color={labelColor}>{limitsInfo.cutOffTime}</Text></Text>
          <Text>Available: <Text as="span" fontWeight="semibold" color={labelColor}>{limitsInfo.availableLimit}</Text></Text>
          <Text>Utilised: <Text as="span" fontWeight="semibold" color={labelColor}>{limitsInfo.utilisedLimit}</Text></Text>
        </Flex>

        {/* Amounts — side by side with FX in between */}
        <Flex align="end" gap={2} direction={{ base: "column", md: "row" }}>
          {/* Payment Amount */}
          <FormControl flex={1}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Payment Amount
            </FormLabel>
            <Flex>
              <Select
                value={form.paymentCurrency}
                onChange={(e) => onChange({ paymentCurrency: e.target.value })}
                w="90px"
                flexShrink={0}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="xs"
                h="38px"
                borderRightRadius={0}
                icon={<IconChevronDown size={12} />}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{currencyFlagMap[c] ?? ""} {c}</option>
                ))}
              </Select>
              <InputGroup flex={1}>
                <Input
                  value={form.paymentAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    const converted = convertAmount(val, form.paymentCurrency, form.debitCurrency);
                    onChange({ paymentAmount: val, lastEditedAmountField: "payment", debitAmount: converted });
                  }}
                  placeholder="0.00"
                  bg={paymentIsReadOnly ? readOnlyBg : fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="sm"
                  h="38px"
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  isReadOnly={paymentIsReadOnly}
                  opacity={paymentIsReadOnly ? 0.7 : 1}
                />
                {paymentIsReadOnly && (
                  <InputRightElement h="38px"><IconLock size={13} color="gray" /></InputRightElement>
                )}
              </InputGroup>
            </Flex>
          </FormControl>

          {/* FX indicator between amounts */}
          {isCrossCurrency && (
            <Flex
              direction="column"
              align="center"
              flexShrink={0}
              mb={1}
              display={{ base: "none", md: "flex" }}
            >
              <IconArrowsExchange size={16} color="gray" />
              <Text fontSize="2xs" color={hintColor} whiteSpace="nowrap">
                {iftFxRates[form.paymentCurrency]?.[form.debitCurrency]
                  ? `1 ${form.paymentCurrency} = ${iftFxRates[form.paymentCurrency][form.debitCurrency]} ${form.debitCurrency}`
                  : ""}
              </Text>
            </Flex>
          )}

          {/* Debit Amount */}
          <FormControl flex={1}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Debit Amount
            </FormLabel>
            <Flex>
              <Select
                value={form.debitCurrency}
                onChange={(e) => onChange({ debitCurrency: e.target.value })}
                w="90px"
                flexShrink={0}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="xs"
                h="38px"
                borderRightRadius={0}
                icon={<IconChevronDown size={12} />}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{currencyFlagMap[c] ?? ""} {c}</option>
                ))}
              </Select>
              <InputGroup flex={1}>
                <Input
                  value={form.debitAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    const converted = convertAmount(val, form.debitCurrency, form.paymentCurrency);
                    onChange({ debitAmount: val, lastEditedAmountField: "debit", paymentAmount: converted });
                  }}
                  placeholder="0.00"
                  bg={debitIsReadOnly ? readOnlyBg : fieldBg}
                  borderColor={borderColor}
                  color={labelColor}
                  fontSize="sm"
                  h="38px"
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  isReadOnly={debitIsReadOnly}
                  opacity={debitIsReadOnly ? 0.7 : 1}
                />
                {debitIsReadOnly && (
                  <InputRightElement h="38px"><IconLock size={13} color="gray" /></InputRightElement>
                )}
              </InputGroup>
            </Flex>
          </FormControl>
        </Flex>

        {/* FX line for mobile */}
        {isCrossCurrency && (
          <Text fontSize="2xs" color={hintColor} display={{ base: "block", md: "none" }}>
            {iftFxRates[form.paymentCurrency]?.[form.debitCurrency]
              ? `1 ${form.paymentCurrency} = ${iftFxRates[form.paymentCurrency][form.debitCurrency]} ${form.debitCurrency} (Indicative)`
              : ""}
          </Text>
        )}

        {/* FX Reference */}
        <Checkbox
          isChecked={form.fxReferenceEnabled}
          onChange={(e) => onChange({ fxReferenceEnabled: e.target.checked })}
          colorScheme="blue"
          size="sm"
        >
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color={labelColor}>FX Transfer Reference</Text>
            <IconInfoCircle size={14} color="gray" />
          </Flex>
        </Checkbox>

        {/* Purpose / Ref / Bene Purpose — 3 cols */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Purpose of Payment</FormLabel>
            <Select
              placeholder="Select"
              value={form.purposeOfPayment}
              onChange={(e) => onChange({ purposeOfPayment: e.target.value })}
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="36px" borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              {purposes.map((p) => <option key={p.code} value={p.code}>{p.label}</option>)}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Customer Reference</FormLabel>
            <Input
              value={form.customerReference}
              onChange={(e) => onChange({ customerReference: e.target.value })}
              placeholder="Reference"
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="36px" borderRadius="4px"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Beneficiary Purpose</FormLabel>
            <Select
              placeholder="Select"
              value={form.beneficiaryPurpose}
              onChange={(e) => onChange({ beneficiaryPurpose: e.target.value })}
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="36px" borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              {beneficiaryPurposes.map((p) => <option key={p.code} value={p.code}>{p.label}</option>)}
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
            onChange={(e) => { if (e.target.value.length <= 140) onChange({ paymentDetails: e.target.value }); }}
            placeholder="Enter payment details"
            bg={fieldBg} borderColor={borderColor} color={labelColor}
            fontSize="sm" borderRadius="4px" rows={2}
          />
          <Flex justify="space-between" mt={0.5}>
            <Text fontSize="2xs" color={hintColor}>Special chars: / - ? : ( ) . , &apos;</Text>
            <Text fontSize="2xs" color={hintColor}>{form.paymentDetails.length}/140</Text>
          </Flex>
        </FormControl>

        {/* Charge Type — inline radio pills */}
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
          <FormControl maxW={{ base: "full", md: "280px" }}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Charge Account No. <Text as="span" color="red.600">*</Text>
            </FormLabel>
            <Select
              value={form.chargeAccountNumber}
              onChange={(e) => onChange({ chargeAccountNumber: e.target.value })}
              placeholder="Select charge account"
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="36px" borderRadius="4px"
              icon={<IconChevronDown size={14} />}
            >
              <option value="4451000040007851">4451000040007851</option>
              <option value="4451000040033488">4451000040033488</option>
              <option value="4451000040008923">4451000040008923</option>
            </Select>
          </FormControl>
        )}
      </Flex>
    </Box>
  );
}
