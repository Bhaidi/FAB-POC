"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { IconChevronDown, IconFilter, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData, SwiftDirectory } from "@/data/beneficiaryTypes";
import { swiftDirectory } from "@/data/beneficiaryMock";
import { BeneSwiftFilterModal } from "./BeneSwiftFilterModal";

interface BeneBankDetailsSectionProps {
  form: BeneficiaryFormData;
  onChange: (patch: Partial<BeneficiaryFormData>) => void;
}

export function BeneBankDetailsSection({
  form,
  onChange,
}: BeneBankDetailsSectionProps) {
  const { dashColors } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const readOnlyBg = useColorModeValue("gray.100", dashColors.surfaceElevated);
  const panelBg = useColorModeValue("white", "#060d24");
  const hoverBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const selectedRowBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.12)");

  const isFab = form.isFabAccount === true;

  const [swiftOpen, setSwiftOpen] = useState(false);
  const [swiftSearch, setSwiftSearch] = useState("");
  const [swiftFocused, setSwiftFocused] = useState(false);
  const swiftRef = useRef<HTMLDivElement>(null);
  const swiftInputRef = useRef<HTMLInputElement>(null);
  const swiftFilterModal = useDisclosure();

  useOutsideClick({
    ref: swiftRef,
    handler: () => {
      setSwiftOpen(false);
      setSwiftSearch("");
      setSwiftFocused(false);
    },
  });

  const filteredSwift = useMemo(() => {
    if (!swiftSearch.trim()) return swiftDirectory;
    const q = swiftSearch.toLowerCase();
    return swiftDirectory.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.bankName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }, [swiftSearch]);

  const recents = filteredSwift.filter((s) => s.isRecent).slice(0, 3);
  const allSorted = [...filteredSwift].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const handleSwiftSelect = useCallback(
    (item: SwiftDirectory) => {
      onChange({
        swiftCode: item.code,
        bankName: item.bankName,
        branchName: item.branchName,
        beneficiaryBankAddress: item.bankAddress,
        bankCity: item.city,
      });
      setSwiftOpen(false);
      setSwiftSearch("");
      setSwiftFocused(false);
    },
    [onChange],
  );

  const selectedSwiftDisplay = form.swiftCode
    ? `${form.swiftCode}`
    : "";

  return (
    <Box p={5} w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {/* SWIFT Code — searchable dropdown with filter */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Swift Code
          </FormLabel>
          <Box position="relative" ref={swiftRef}>
            <Flex gap={1}>
              <InputGroup flex={1}>
                <Input
                  ref={swiftInputRef}
                  h="40px"
                  bg={isFab ? readOnlyBg : fieldBg}
                  isReadOnly={isFab}
                  borderColor={borderColor}
                  borderRadius="4px"
                  fontSize="sm"
                  color={labelColor}
                  placeholder="Enter SWIFT Code"
                  value={swiftFocused ? swiftSearch : selectedSwiftDisplay}
                  onChange={(e) => {
                    setSwiftSearch(e.target.value);
                    if (!swiftOpen) setSwiftOpen(true);
                  }}
                  onFocus={() => {
                    if (isFab) return;
                    setSwiftFocused(true);
                    setSwiftSearch("");
                    setSwiftOpen(true);
                  }}
                  autoComplete="off"
                />
                <InputRightElement h="40px" pointerEvents="all" cursor="pointer" onClick={() => {
                  if (isFab) return;
                  setSwiftOpen((p) => !p);
                  if (!swiftOpen) {
                    setSwiftFocused(true);
                    setSwiftSearch("");
                    swiftInputRef.current?.focus();
                  }
                }}>
                  <IconChevronDown size={16} color="gray" />
                </InputRightElement>
              </InputGroup>
              {!isFab && (
                <IconButton
                  aria-label="Filter SWIFT codes"
                  icon={<IconFilter size={16} />}
                  h="40px"
                  w="40px"
                  variant="outline"
                  borderColor="accent.linkCta"
                  color="accent.linkCta"
                  onClick={() => swiftFilterModal.onOpen()}
                />
              )}
            </Flex>

            {/* Dropdown panel */}
            {swiftOpen && !isFab && (
              <Box
                position="absolute"
                top="44px"
                left={0}
                right={0}
                zIndex={1400}
                bg={panelBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                shadow="lg"
                maxH="340px"
                overflowY="auto"
              >
                {recents.length > 0 && (
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color={labelColor} px={4} py={2}>
                      Recents
                    </Text>
                    {recents.map((item) => (
                      <SwiftRow
                        key={item.code}
                        item={item}
                        isSelected={item.code === form.swiftCode}
                        hoverBg={hoverBg}
                        selectedBg={selectedRowBg}
                        labelColor={labelColor}
                        hintColor={hintColor}
                        onClick={() => handleSwiftSelect(item)}
                      />
                    ))}
                  </Box>
                )}
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color={labelColor} px={4} py={2}>
                    All
                  </Text>
                  {allSorted.map((item) => (
                    <SwiftRow
                      key={item.code}
                      item={item}
                      isSelected={item.code === form.swiftCode}
                      hoverBg={hoverBg}
                      selectedBg={selectedRowBg}
                      labelColor={labelColor}
                      hintColor={hintColor}
                      onClick={() => handleSwiftSelect(item)}
                    />
                  ))}
                  {allSorted.length === 0 && (
                    <Text fontSize="xs" color={hintColor} px={4} py={4} textAlign="center">
                      No SWIFT codes found
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </FormControl>

        {/* Bank Name — read-only */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Bank Name
          </FormLabel>
          <Input
            value={form.bankName}
            isReadOnly
            placeholder="Bank Name"
            bg={readOnlyBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* Branch Name — read-only */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Branch Name
          </FormLabel>
          <Input
            value={form.branchName}
            isReadOnly
            placeholder="Branch Name"
            bg={readOnlyBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* Beneficiary Bank Address — read-only */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Bank Address
          </FormLabel>
          <Input
            value={form.beneficiaryBankAddress}
            isReadOnly
            placeholder="Bank Address"
            bg={readOnlyBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* City — read-only */}
        <FormControl isRequired>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            City
          </FormLabel>
          <Input
            value={form.bankCity}
            isReadOnly
            placeholder="City"
            bg={readOnlyBg}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>

        {/* Routing Code — editable */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Routing Code
          </FormLabel>
          <Input
            value={form.routingCode}
            onChange={(e) => onChange({ routingCode: e.target.value })}
            placeholder="Enter Routing Code"
            bg={isFab ? readOnlyBg : fieldBg}
            isReadOnly={isFab}
            borderColor={borderColor}
            color={labelColor}
            fontSize="sm"
            h="40px"
            borderRadius="4px"
          />
        </FormControl>
      </SimpleGrid>

      {/* SWIFT filter modal */}
      <BeneSwiftFilterModal
        isOpen={swiftFilterModal.isOpen}
        onClose={swiftFilterModal.onClose}
        onSelect={handleSwiftSelect}
        selectedCode={form.swiftCode}
      />
    </Box>
  );
}

/* ── SWIFT Row ────────────────────────────────── */

function SwiftRow({
  item,
  isSelected,
  hoverBg,
  selectedBg,
  labelColor,
  hintColor,
  onClick,
}: {
  item: SwiftDirectory;
  isSelected: boolean;
  hoverBg: string;
  selectedBg: string;
  labelColor: string;
  hintColor: string;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      w="full"
      px={4}
      py={2.5}
      align="center"
      gap={3}
      cursor="pointer"
      bg={isSelected ? selectedBg : "transparent"}
      _hover={{ bg: isSelected ? selectedBg : hoverBg }}
      onClick={onClick}
      textAlign="left"
    >
      <Flex direction="column" flex={1} minW={0}>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="semibold" color={labelColor} noOfLines={1}>
            {item.code}
          </Text>
          {item.isFavorite && (
            <IconStarFilled size={12} color="#F59E0B" />
          )}
        </Flex>
        <Text fontSize="xs" color={hintColor} noOfLines={1}>
          {item.bankName}
        </Text>
        <Text fontSize="2xs" color={hintColor} noOfLines={1}>
          {item.city}, {item.country}
        </Text>
      </Flex>
    </Flex>
  );
}
