"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChevronDown, IconUpload } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneCountries } from "@/data/beneficiaryMock";
import type { IftCountry } from "@/data/iftPaymentTypes";

interface BeneAdditionalSectionProps {
  form: BeneficiaryFormData;
  onChange: (patch: Partial<BeneficiaryFormData>) => void;
}

export function BeneAdditionalSection({
  form,
  onChange,
}: BeneAdditionalSectionProps) {
  const { dashColors } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const dropzoneHoverBg = useColorModeValue("gray.50", dashColors.surfaceHover);

  return (
    <Box p={5} w="full">
      <Flex direction="column" gap={5}>
        {/* Intermediary Bank Details */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color={labelColor} mb={3}>
            Intermediary Bank Details
          </Text>
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
                <option value="CITIUS33XXX">CITIUS33XXX</option>
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
                {beneCountries.map((c: IftCountry) => (
                  <option key={c.code} value={c.code}>
                    {c.flagEmoji} {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* Supporting Documents */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color={labelColor} mb={1}>
            Supporting Documents (For Approver Only)
          </Text>
          <Box
            borderWidth="1px"
            borderStyle="dashed"
            borderColor={borderColor}
            borderRadius="lg"
            py={6}
            px={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ bg: dropzoneHoverBg }}
            transition="background 0.15s"
            mt={2}
            onClick={() => {
              document.getElementById("bene-file-upload")?.click();
            }}
          >
            <input
              id="bene-file-upload"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.xlsx"
              style={{ display: "none" }}
            />
            <Flex direction="column" align="center" gap={4}>
              <IconUpload size={24} color="gray" />
              <Box>
                <Text fontSize="sm" fontWeight="bold" color={labelColor}>
                  Choose a file or drag &amp; drop it here
                </Text>
                <Text fontSize="xs" color={hintColor} mt={2}>
                  Maximum 5 documents allowed. JPEG, PNG, PDF, and XLSX formats, up to 10MB total size.
                </Text>
              </Box>
              <Button
                variant="outline"
                size="sm"
                borderColor="accent.linkCta"
                color="accent.linkCta"
                borderRadius="sm"
                fontWeight="medium"
                _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
              >
                Browse File
              </Button>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
