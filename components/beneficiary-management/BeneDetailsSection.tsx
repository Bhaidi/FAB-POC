"use client";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { phoneCountryCodes } from "@/data/beneficiaryMock";

interface BeneDetailsSectionProps {
  form: BeneficiaryFormData;
  onChange: (patch: Partial<BeneficiaryFormData>) => void;
}

export function BeneDetailsSection({
  form,
  onChange,
}: BeneDetailsSectionProps) {
  const { dashColors } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);

  const isFab = form.isFabAccount === true;
  const bg = isFab ? readOnlyBg : fieldBg;

  return (
    <Box p={5} w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {/* Row 1 */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Nick Name
          </FormLabel>
          <Input
            value={form.beneficiaryNickName}
            onChange={(e) => onChange({ beneficiaryNickName: e.target.value })}
            isReadOnly={isFab}
            placeholder="Enter Nick Name"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Name
          </FormLabel>
          <Input
            value={form.beneficiaryName}
            onChange={(e) => onChange({ beneficiaryName: e.target.value })}
            isReadOnly={isFab}
            placeholder="Enter Full Name"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Building Number
          </FormLabel>
          <Input
            value={form.buildingNumber}
            onChange={(e) => onChange({ buildingNumber: e.target.value })}
            isReadOnly={isFab}
            placeholder="Building No."
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* Row 2 */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Street Name
          </FormLabel>
          <Input
            value={form.streetName}
            onChange={(e) => onChange({ streetName: e.target.value })}
            isReadOnly={isFab}
            placeholder="Street Name"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Address Line
          </FormLabel>
          <Input
            value={form.addressLine}
            onChange={(e) => onChange({ addressLine: e.target.value })}
            isReadOnly={isFab}
            placeholder="Full Address"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Town/City Name
          </FormLabel>
          <Input
            value={form.townCityName}
            onChange={(e) => onChange({ townCityName: e.target.value })}
            isReadOnly={isFab}
            placeholder="Town / City"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* Row 3 */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Country Subdivision
          </FormLabel>
          <Input
            value={form.countrySubdivision}
            onChange={(e) => onChange({ countrySubdivision: e.target.value })}
            isReadOnly={isFab}
            placeholder="State / Province"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Postal/Zip Code
          </FormLabel>
          <Input
            value={form.postalZipCode}
            onChange={(e) => onChange({ postalZipCode: e.target.value })}
            isReadOnly={isFab}
            placeholder="Postal / Zip Code"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Contact Number
          </FormLabel>
          <Flex gap={1}>
            <Select
              value={form.contactCountryCode}
              onChange={(e) => onChange({ contactCountryCode: e.target.value })}
              isDisabled={isFab}
              bg={bg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              w="110px"
              flexShrink={0}
              icon={<IconChevronDown size={14} />}
            >
              {phoneCountryCodes.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </Select>
            <Input
              value={form.contactNumber}
              onChange={(e) => onChange({ contactNumber: e.target.value })}
              isReadOnly={isFab}
              placeholder="Phone Number"
              bg={bg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
            />
          </Flex>
        </FormControl>

        {/* Row 4 */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Email Address
          </FormLabel>
          <Input
            value={form.beneficiaryEmail}
            onChange={(e) => onChange({ beneficiaryEmail: e.target.value })}
            isReadOnly={isFab}
            placeholder="email@example.com"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
            type="email"
          />
          <Text fontSize="xs" color={hintColor} mt={1}>
            Max. 5 email addresses are allowed. Use comma (,) for multiple email IDs.
          </Text>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Customer Identification Number
          </FormLabel>
          <Input
            value={form.customerIdentificationNumber}
            onChange={(e) => onChange({ customerIdentificationNumber: e.target.value })}
            isReadOnly={isFab}
            placeholder="CID / National ID"
            bg={bg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>
      </SimpleGrid>
    </Box>
  );
}
