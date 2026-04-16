"use client";

import { useCallback, useEffect } from "react";
import {
  Box,
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
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCalendar, IconChevronDown, IconInfoCircle, IconLock } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { currencyFlagMap, iftFxRates } from "@/data/iftPaymentMock";
import type { IftChargeOption, IftFormData, IftPurpose } from "@/data/iftPaymentTypes";

interface IftPaymentDetailsSectionProps {
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

export function IftPaymentDetailsSection({
  form,
  purposes,
  beneficiaryPurposes,
  chargeOptions,
  limitsInfo,
  onChange,
}: IftPaymentDetailsSectionProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const infoBg = useColorModeValue("blue.50", dashColors.surfaceElevated);
  const infoBorder = useColorModeValue("blue.100", dashColors.cardBorder);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const paymentIsReadOnly = form.lastEditedAmountField === "debit" && !!form.debitAmount;
  const debitIsReadOnly = form.lastEditedAmountField === "payment" && !!form.paymentAmount;

  /* Auto-convert on amount or currency change */
  const autoConvert = useCallback(() => {
    if (form.lastEditedAmountField === "payment" && form.paymentAmount) {
      const converted = convertAmount(form.paymentAmount, form.paymentCurrency, form.debitCurrency);
      if (converted !== form.debitAmount) {
        onChange({ debitAmount: converted });
      }
    } else if (form.lastEditedAmountField === "debit" && form.debitAmount) {
      const converted = convertAmount(form.debitAmount, form.debitCurrency, form.paymentCurrency);
      if (converted !== form.paymentAmount) {
        onChange({ paymentAmount: converted });
      }
    }
  }, [form.paymentAmount, form.debitAmount, form.paymentCurrency, form.debitCurrency, form.lastEditedAmountField, onChange]);

  useEffect(() => {
    autoConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.paymentCurrency, form.debitCurrency]);

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" p={5} w="full">
      <Flex direction="column" gap={4}>
        {/* Payment type radio */}
        <RadioGroup
          value={form.paymentType}
          onChange={(val) => onChange({ paymentType: val as IftFormData["paymentType"] })}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box
              borderWidth="1px"
              borderColor={form.paymentType === "one-time" ? "accent.linkCta" : borderColor}
              borderRadius="4px"
              px={3}
              py={3}
              cursor="pointer"
              onClick={() => onChange({ paymentType: "one-time" })}
            >
              <Radio value="one-time" colorScheme="blue">
                <Text fontSize="sm" color={labelColor}>One time Payment</Text>
              </Radio>
            </Box>
            <Box
              borderWidth="1px"
              borderColor={form.paymentType === "recurring" ? "accent.linkCta" : borderColor}
              borderRadius="4px"
              px={3}
              py={3}
              cursor="pointer"
              onClick={() => onChange({ paymentType: "recurring" })}
            >
              <Radio value="recurring" colorScheme="blue">
                <Text fontSize="sm" color={labelColor}>Recurring Payment</Text>
              </Radio>
            </Box>
          </SimpleGrid>
        </RadioGroup>

        {/* Payment date */}
        <FormControl maxW={{ base: "full", md: "50%" }}>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Payment Date <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Box
            position="relative"
            onClick={() => {
              const el = document.getElementById("ift-payment-date") as HTMLInputElement | null;
              el?.showPicker?.();
              el?.focus();
            }}
            cursor="pointer"
          >
            <Input
              id="ift-payment-date"
              type="date"
              value={form.paymentDate}
              onChange={(e) => onChange({ paymentDate: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              cursor="pointer"
              w="full"
            />
          </Box>
        </FormControl>

        {/* Information bar — Limits / Cut-off */}
        <Box
          bg={infoBg}
          borderWidth="1px"
          borderColor={infoBorder}
          borderRadius="sm"
          px={4}
          py={4}
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box>
              <Flex align="center" gap={1}>
                <Text fontSize="xs" color={hintColor}>Cut-off Time</Text>
                <IconInfoCircle size={13} color="gray" />
              </Flex>
              <Text fontSize="xs" fontWeight="medium" color={labelColor} mt={1}>
                {limitsInfo.cutOffTime}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={hintColor}>Available Limit</Text>
              <Text fontSize="xs" fontWeight="medium" color={labelColor} mt={1}>
                {limitsInfo.availableLimit}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={hintColor}>Utilised Limit</Text>
              <Text fontSize="xs" fontWeight="medium" color={labelColor} mt={1}>
                {limitsInfo.utilisedLimit}
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Amount fields — each 50% */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} alignItems="end">
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Payment Amount
            </FormLabel>
            <Flex w="full">
              <Select
                value={form.paymentCurrency}
                onChange={(e) => onChange({ paymentCurrency: e.target.value })}
                w="100px"
                flexShrink={0}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="sm"
                h="40px"
                borderRightRadius={0}
                icon={<IconChevronDown size={14} />}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {currencyFlagMap[c] ?? ""} {c}
                  </option>
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
                  h="40px"
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  isReadOnly={paymentIsReadOnly}
                  opacity={paymentIsReadOnly ? 0.7 : 1}
                />
                {paymentIsReadOnly && (
                  <InputRightElement h="40px">
                    <IconLock size={14} color="gray" />
                  </InputRightElement>
                )}
              </InputGroup>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Debit Amount
            </FormLabel>
            <Flex w="full">
              <Select
                value={form.debitCurrency}
                onChange={(e) => onChange({ debitCurrency: e.target.value })}
                w="100px"
                flexShrink={0}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="sm"
                h="40px"
                borderRightRadius={0}
                icon={<IconChevronDown size={14} />}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {currencyFlagMap[c] ?? ""} {c}
                  </option>
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
                  h="40px"
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  isReadOnly={debitIsReadOnly}
                  opacity={debitIsReadOnly ? 0.7 : 1}
                />
                {debitIsReadOnly && (
                  <InputRightElement h="40px">
                    <IconLock size={14} color="gray" />
                  </InputRightElement>
                )}
              </InputGroup>
            </Flex>
          </FormControl>
        </SimpleGrid>

        {/* FX Rate indicator */}
        <Text fontSize="xs" color={hintColor}>
          {form.paymentCurrency === form.debitCurrency
            ? "No FX conversion required"
            : iftFxRates[form.paymentCurrency]?.[form.debitCurrency]
              ? `1 ${form.paymentCurrency} = ${iftFxRates[form.paymentCurrency][form.debitCurrency]} ${form.debitCurrency} (Indicative)`
              : "No FX conversion required"}
        </Text>

        {/* FX Reference checkbox */}
        <Checkbox
          isChecked={form.fxReferenceEnabled}
          onChange={(e) => onChange({ fxReferenceEnabled: e.target.checked })}
          colorScheme="blue"
        >
          <Flex align="center" gap={1}>
            <Text fontSize="sm" color={labelColor}>FX Transfer Reference</Text>
            <IconInfoCircle size={16} color="gray" />
          </Flex>
        </Checkbox>

        {/* Purpose section — 3 columns in one row */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Purpose of Payment
            </FormLabel>
            <Select
              placeholder="Select purpose"
              value={form.purposeOfPayment}
              onChange={(e) => onChange({ purposeOfPayment: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              icon={<IconChevronDown size={18} />}
            >
              {purposes.map((p) => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Customer Reference
            </FormLabel>
            <Input
              value={form.customerReference}
              onChange={(e) => onChange({ customerReference: e.target.value })}
              placeholder="Enter reference"
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Beneficiary Purpose
            </FormLabel>
            <Select
              placeholder="Select beneficiary purpose"
              value={form.beneficiaryPurpose}
              onChange={(e) => onChange({ beneficiaryPurpose: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              icon={<IconChevronDown size={18} />}
            >
              {beneficiaryPurposes.map((p) => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        {/* Payment Details textarea */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Payment Details <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Textarea
            value={form.paymentDetails}
            onChange={(e) => {
              if (e.target.value.length <= 140) {
                onChange({ paymentDetails: e.target.value });
              }
            }}
            placeholder="Enter payment details"
            bg={fieldBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            borderRadius="4px"
            rows={3}
          />
          <Flex justify="space-between" mt={1}>
            <Text fontSize="xs" color={hintColor}>
              {`Only these special characters are allowed: / - ? : ( ) . , '`}
            </Text>
            <Text fontSize="xs" color={hintColor}>
              {form.paymentDetails.length}/140 Characters
            </Text>
          </Flex>
        </FormControl>

        {/* Charges — Radio buttons per screenshot */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Charge Type <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <RadioGroup
            value={form.chargeType}
            onChange={(val) => onChange({ chargeType: val })}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              {chargeOptions.map((opt) => (
                <Box
                  key={opt.value}
                  borderWidth="1px"
                  borderColor={form.chargeType === opt.value ? "accent.linkCta" : borderColor}
                  borderRadius="4px"
                  px={4}
                  py={3}
                  cursor="pointer"
                  onClick={() => onChange({ chargeType: opt.value })}
                  transition="border-color 0.15s"
                >
                  <Radio value={opt.value} colorScheme="blue">
                    <Text fontSize="sm" fontWeight="semibold" color={labelColor}>
                      {opt.label}
                    </Text>
                  </Radio>
                  <Text fontSize="xs" color={hintColor} mt={1} ml={6}>
                    {opt.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </RadioGroup>
        </FormControl>

        {(form.chargeType === "OUR" || form.chargeType === "SHA") && (
        <FormControl maxW={{ base: "full", md: "304px" }}>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Charge Account No. <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Select
            value={form.chargeAccountNumber}
            onChange={(e) => onChange({ chargeAccountNumber: e.target.value })}
            placeholder="Select charge account"
            bg={fieldBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
            icon={<IconChevronDown size={18} />}
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
