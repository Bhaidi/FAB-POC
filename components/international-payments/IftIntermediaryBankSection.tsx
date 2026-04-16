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
import type { IftCountry, IftFormData } from "@/data/iftPaymentTypes";

interface IftIntermediaryBankSectionProps {
  form: IftFormData;
  countries: IftCountry[];
  onChange: (patch: Partial<IftFormData>) => void;
}

export function IftIntermediaryBankSection({
  form,
  countries,
  onChange,
}: IftIntermediaryBankSectionProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" p={5} w="full">
      <Flex direction="column" gap={3}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              SWIFT Code
            </FormLabel>
            <Select
              placeholder="Enter SWIFT Code"
              value={form.intermediarySwiftCode}
              onChange={(e) => onChange({ intermediarySwiftCode: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              icon={<IconChevronDown size={18} />}
            >
              <option value="ABCEGB2LXXX">ABCEGB2LXXX</option>
              <option value="CHASUS33XXX">CHASUS33XXX</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
              Bank Name
            </FormLabel>
            <Input
              value={form.intermediaryBankName}
              onChange={(e) => onChange({ intermediaryBankName: e.target.value })}
              placeholder="Intermediary Bank Name"
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
              Country
            </FormLabel>
            <Select
              placeholder="Intermediary Bank Country"
              value={form.intermediaryCountry}
              onChange={(e) => onChange({ intermediaryCountry: e.target.value })}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="40px"
              borderRadius="4px"
              icon={<IconChevronDown size={18} />}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
