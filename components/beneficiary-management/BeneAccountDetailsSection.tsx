"use client";

import { useCallback } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneCountries, beneCurrencyFlagMap, lookupFabAccount } from "@/data/beneficiaryMock";
import type { IftCountry } from "@/data/iftPaymentTypes";

interface BeneAccountDetailsSectionProps {
  form: BeneficiaryFormData;
  onChange: (patch: Partial<BeneficiaryFormData>) => void;
}

export function BeneAccountDetailsSection({
  form,
  onChange,
}: BeneAccountDetailsSectionProps) {
  const { dashColors } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const handleIbanBlur = useCallback(async () => {
    const val = form.beneficiaryAccountNo.trim();
    if (!val || !form.bankCountry) return;
    if (form.accountLookupDone && !form.accountLookupLoading) return;

    onChange({ accountLookupLoading: true, accountLookupDone: false, isFabAccount: null });

    const result = await lookupFabAccount(val);
    if (result.found) {
      onChange({
        accountLookupLoading: false,
        accountLookupDone: true,
        isFabAccount: true,
        beneficiaryCurrency: result.currency ?? "",
        swiftCode: result.swiftCode ?? "",
        bankName: result.bankName ?? "",
        branchName: result.branchName ?? "",
        beneficiaryBankAddress: result.bankAddress ?? "",
        bankCity: result.bankCity ?? "",
        beneficiaryName: result.beneficiaryName ?? "",
        beneficiaryNickName: result.beneficiaryNickName ?? "",
        buildingNumber: result.buildingNumber ?? "",
        streetName: result.streetName ?? "",
        addressLine: result.addressLine ?? "",
        townCityName: result.townCityName ?? "",
        countrySubdivision: result.countrySubdivision ?? "",
        postalZipCode: result.postalZipCode ?? "",
        contactCountryCode: result.contactCountryCode ?? "+971",
        contactNumber: result.contactNumber ?? "",
        beneficiaryEmail: result.beneficiaryEmail ?? "",
        customerIdentificationNumber: result.customerIdentificationNumber ?? "",
      });
    } else {
      onChange({
        accountLookupLoading: false,
        accountLookupDone: true,
        isFabAccount: false,
      });
    }
  }, [form.beneficiaryAccountNo, form.bankCountry, form.accountLookupDone, form.accountLookupLoading, onChange]);

  /* Currency options — unique from country list */
  const currencyOptions: { code: string; label: string; flag: string }[] = [];
  const seen = new Set<string>();
  beneCountries.forEach((c: IftCountry) => {
    if (!seen.has(c.currency)) {
      seen.add(c.currency);
      currencyOptions.push({
        code: c.currency,
        label: c.currency,
        flag: beneCurrencyFlagMap[c.currency] ?? "",
      });
    }
  });

  return (
    <Box p={5} w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {/* Bank Country */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Bank Country
          </FormLabel>
          <Select
            placeholder="Select Country"
            value={form.bankCountry}
            onChange={(e) => {
              onChange({
                bankCountry: e.target.value,
                beneficiaryAccountNo: "",
                beneficiaryCurrency: "",
                isFabAccount: null,
                accountLookupDone: false,
                accountLookupLoading: false,
              });
            }}
            bg={fieldBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
            icon={<IconChevronDown size={18} />}
          >
            {beneCountries.map((c: IftCountry) => (
              <option key={c.code} value={c.code}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Beneficiary Account No. (or) IBAN */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Account No. (or) IBAN
          </FormLabel>
          <InputGroup>
            <Input
              value={form.beneficiaryAccountNo}
              onChange={(e) =>
                onChange({
                  beneficiaryAccountNo: e.target.value,
                  accountLookupDone: false,
                  isFabAccount: null,
                })
              }
              onBlur={handleIbanBlur}
              placeholder="Enter IBAN / Account Number"
              isDisabled={!form.bankCountry}
              bg={form.isFabAccount ? readOnlyBg : fieldBg}
              isReadOnly={form.isFabAccount === true}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
            />
            {form.accountLookupLoading && (
              <InputRightElement h="40px">
                <Spinner size="sm" color="accent.linkCta" />
              </InputRightElement>
            )}
          </InputGroup>
          {form.isFabAccount === true && (
            <Badge mt={1} colorScheme="green" fontSize="2xs" borderRadius="sm">
              FAB Account Detected
            </Badge>
          )}
        </FormControl>

        {/* Beneficiary Account Currency — always visible; disabled until lookup completes */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Account Currency
          </FormLabel>
          <Select
            placeholder="Select Currency"
            value={form.beneficiaryCurrency}
            onChange={(e) => onChange({ beneficiaryCurrency: e.target.value })}
            bg={form.isFabAccount ? readOnlyBg : fieldBg}
            isDisabled={!form.accountLookupDone || form.isFabAccount === true}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
            icon={<IconChevronDown size={18} />}
          >
            {currencyOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>

      {/* FAB account info banner */}
      {form.isFabAccount === true && (
        <Flex
          mt={4}
          px={4}
          py={2}
          bg={useColorModeValue("blue.50", "rgba(0,98,255,0.08)")}
          borderWidth="1px"
          borderColor={useColorModeValue("blue.200", "rgba(0,98,255,0.2)")}
          borderRadius="md"
          align="center"
          gap={2}
        >
          <Text fontSize="xs" fontWeight="medium" color={useColorModeValue("blue.700", "#60A5FA")}>
            ℹ️ This is a FAB account. Details have been auto-populated.
          </Text>
        </Flex>
      )}
    </Box>
  );
}
