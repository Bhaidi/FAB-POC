"use client";

import { useCallback, useEffect } from "react";
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
  IconArrowRight,
  IconRepeat,
  IconCalendarEvent,
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
 * Payment Details — Option 3
 * Minimal single-flow layout. Type shown as icon+text inline.
 * Amounts stacked as a visual "from → to" flow.
 * Charge type as segmented control. Fewest vertical lines.
 */
export function IftPaymentDetailsSection3({
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
  const pillActiveBg = useColorModeValue("accent.linkCta", "#3B82F6");
  const iftBg = useColorModeValue("orange.50", "rgba(251,146,60,0.12)");
  const iftColor = useColorModeValue("orange.700", "orange.300");
  const domesticBg = useColorModeValue("green.50", "rgba(34,197,94,0.12)");
  const domesticColor = useColorModeValue("green.700", "green.300");
  const segBg = useColorModeValue("gray.100", dashColors.surfaceElevated);
  const segActiveBg = useColorModeValue("white", dashColors.cardBg);

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

  const fxText = iftFxRates[form.paymentCurrency]?.[form.debitCurrency]
    ? `1 ${form.paymentCurrency} = ${iftFxRates[form.paymentCurrency][form.debitCurrency]} ${form.debitCurrency}`
    : null;

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" px={5} py={4} w="full">
      <Flex direction="column" gap={3}>

        {/* ── Row 1: Type icon + label  |  IFT badge  |  date ── */}
        <Flex align="center" gap={3} flexWrap="wrap">
          {/* Type selector as clickable chips */}
          <HStack spacing={2}>
            <Flex
              as="button"
              align="center"
              gap={1.5}
              px={3}
              h="32px"
              borderRadius="full"
              fontSize="xs"
              fontWeight="semibold"
              bg={form.paymentType === "one-time" ? pillActiveBg : "transparent"}
              color={form.paymentType === "one-time" ? "white" : labelColor}
              borderWidth="1px"
              borderColor={form.paymentType === "one-time" ? pillActiveBg : borderColor}
              onClick={() => onChange({ paymentType: "one-time" })}
              transition="all 0.15s"
            >
              <IconCalendarEvent size={14} />
              One-time
            </Flex>
            <Flex
              as="button"
              align="center"
              gap={1.5}
              px={3}
              h="32px"
              borderRadius="full"
              fontSize="xs"
              fontWeight="semibold"
              bg={form.paymentType === "recurring" ? pillActiveBg : "transparent"}
              color={form.paymentType === "recurring" ? "white" : labelColor}
              borderWidth="1px"
              borderColor={form.paymentType === "recurring" ? pillActiveBg : borderColor}
              onClick={() => onChange({ paymentType: "recurring" })}
              transition="all 0.15s"
            >
              <IconRepeat size={14} />
              Recurring
            </Flex>
          </HStack>

          {/* Transfer type badge */}
          <Badge
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="2xs"
            fontWeight="semibold"
            bg={isCrossCurrency ? iftBg : domesticBg}
            color={isCrossCurrency ? iftColor : domesticColor}
            variant="subtle"
          >
            {isCrossCurrency ? "IFT" : "Domestic"}
          </Badge>

          {/* Date — right-aligned, one-time only */}
          {form.paymentType === "one-time" && (
            <Box
              ml="auto"
              onClick={() => {
                const el = document.getElementById("ift-pd3-date") as HTMLInputElement | null;
                el?.showPicker?.();
                el?.focus();
              }}
              cursor="pointer"
            >
              <Input
                id="ift-pd3-date"
                type="date"
                value={form.paymentDate}
                onChange={(e) => onChange({ paymentDate: e.target.value })}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="xs"
                h="32px"
                w="160px"
                borderRadius="4px"
                cursor="pointer"
              />
            </Box>
          )}
        </Flex>

        {/* ── Amounts: visual "pay → debit" flow ── */}
        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={3}
        >
          <Flex align="end" gap={2} direction={{ base: "column", md: "row" }}>
            {/* Pay amount */}
            <FormControl flex={1}>
              <Text fontSize="2xs" color={hintColor} mb={1} fontWeight="medium">You pay</Text>
              <Flex>
                <Select
                  value={form.paymentCurrency}
                  onChange={(e) => onChange({ paymentCurrency: e.target.value })}
                  w="85px" flexShrink={0} bg={fieldBg} borderColor={borderColor}
                  color={labelColor} fontSize="xs" h="36px" borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{currencyFlagMap[c]} {c}</option>)}
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
                    borderColor={borderColor} color={labelColor} fontSize="sm"
                    h="36px" borderLeftRadius={0} borderLeftWidth={0}
                    isReadOnly={paymentIsReadOnly} opacity={paymentIsReadOnly ? 0.7 : 1}
                  />
                  {paymentIsReadOnly && <InputRightElement h="36px"><IconLock size={12} color="gray" /></InputRightElement>}
                </InputGroup>
              </Flex>
            </FormControl>

            {/* Arrow + FX rate */}
            <Flex direction="column" align="center" flexShrink={0} mb={1} display={{ base: "none", md: "flex" }}>
              <IconArrowRight size={14} color="gray" />
              {fxText && <Text fontSize="2xs" color={hintColor} whiteSpace="nowrap" mt={0.5}>{fxText}</Text>}
            </Flex>

            {/* Debit amount */}
            <FormControl flex={1}>
              <Text fontSize="2xs" color={hintColor} mb={1} fontWeight="medium">They receive (debit)</Text>
              <Flex>
                <Select
                  value={form.debitCurrency}
                  onChange={(e) => onChange({ debitCurrency: e.target.value })}
                  w="85px" flexShrink={0} bg={fieldBg} borderColor={borderColor}
                  color={labelColor} fontSize="xs" h="36px" borderRightRadius={0}
                  icon={<IconChevronDown size={12} />}
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{currencyFlagMap[c]} {c}</option>)}
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
                    borderColor={borderColor} color={labelColor} fontSize="sm"
                    h="36px" borderLeftRadius={0} borderLeftWidth={0}
                    isReadOnly={debitIsReadOnly} opacity={debitIsReadOnly ? 0.7 : 1}
                  />
                  {debitIsReadOnly && <InputRightElement h="36px"><IconLock size={12} color="gray" /></InputRightElement>}
                </InputGroup>
              </Flex>
            </FormControl>
          </Flex>

          {/* Mobile FX */}
          {isCrossCurrency && fxText && (
            <Text fontSize="2xs" color={hintColor} mt={2} display={{ base: "block", md: "none" }}>{fxText} (Indicative)</Text>
          )}
        </Box>

        {/* Limits bar */}
        <Flex bg={infoBg} borderWidth="1px" borderColor={infoBorder} borderRadius="sm" px={3} py={1.5} gap={4} fontSize="2xs" color={hintColor} flexWrap="wrap">
          <Text>Cut-off: <Text as="span" fontWeight="semibold" color={labelColor}>{limitsInfo.cutOffTime}</Text></Text>
          <Text>Limit: <Text as="span" fontWeight="semibold" color={labelColor}>{limitsInfo.availableLimit}</Text></Text>
        </Flex>

        {/* FX Reference */}
        <Checkbox
          isChecked={form.fxReferenceEnabled}
          onChange={(e) => onChange({ fxReferenceEnabled: e.target.checked })}
          colorScheme="blue"
          size="sm"
        >
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color={labelColor}>FX Transfer Reference</Text>
            <IconInfoCircle size={13} color="gray" />
          </Flex>
        </Checkbox>

        {/* Purpose / Ref / Bene Purpose */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Purpose</FormLabel>
            <Select
              placeholder="Select"
              value={form.purposeOfPayment}
              onChange={(e) => onChange({ purposeOfPayment: e.target.value })}
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="34px" borderRadius="4px" icon={<IconChevronDown size={14} />}
            >
              {purposes.map((p) => <option key={p.code} value={p.code}>{p.label}</option>)}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Reference</FormLabel>
            <Input
              value={form.customerReference}
              onChange={(e) => onChange({ customerReference: e.target.value })}
              placeholder="Enter"
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="34px" borderRadius="4px"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>Bene Purpose</FormLabel>
            <Select
              placeholder="Select"
              value={form.beneficiaryPurpose}
              onChange={(e) => onChange({ beneficiaryPurpose: e.target.value })}
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="34px" borderRadius="4px" icon={<IconChevronDown size={14} />}
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
            <Text fontSize="2xs" color={hintColor}>/ - ? : ( ) . , &apos;</Text>
            <Text fontSize="2xs" color={hintColor}>{form.paymentDetails.length}/140</Text>
          </Flex>
        </FormControl>

        {/* Charge Type — segmented control */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
            Charge Type <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Flex bg={segBg} borderRadius="md" p={1} gap={1}>
            {chargeOptions.map((opt) => (
              <Box
                key={opt.value}
                as="button"
                flex={1}
                py={2}
                px={2}
                borderRadius="md"
                bg={form.chargeType === opt.value ? segActiveBg : "transparent"}
                shadow={form.chargeType === opt.value ? "sm" : "none"}
                onClick={() => onChange({ chargeType: opt.value })}
                transition="all 0.15s"
                textAlign="center"
              >
                <Text fontSize="xs" fontWeight="semibold" color={labelColor}>{opt.label}</Text>
                <Text fontSize="2xs" color={hintColor} mt={0.5}>{opt.description}</Text>
              </Box>
            ))}
          </Flex>
        </FormControl>

        {/* Charge Account */}
        {(form.chargeType === "OUR" || form.chargeType === "SHA") && (
          <FormControl maxW={{ base: "full", md: "260px" }}>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
              Charge Account <Text as="span" color="red.600">*</Text>
            </FormLabel>
            <Select
              value={form.chargeAccountNumber}
              onChange={(e) => onChange({ chargeAccountNumber: e.target.value })}
              placeholder="Select"
              bg={fieldBg} borderColor={borderColor} color={labelColor}
              fontSize="xs" h="34px" borderRadius="4px" icon={<IconChevronDown size={14} />}
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
