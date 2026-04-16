"use client";

import { useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IconChevronDown, IconFilter, IconArrowRight } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftBeneficiary, IftDebitAccount } from "@/data/iftPaymentTypes";
import { IftAccountDropdown, type AccountItem } from "./IftAccountDropdown";
import { IftAccountFilterModal } from "./IftAccountFilterModal";

interface Props {
  debitAccounts: IftDebitAccount[];
  beneficiaries: IftBeneficiary[];
  selectedDebitId: string;
  selectedBeneficiaryId: string;
  onDebitChange: (id: string) => void;
  onBeneficiaryChange: (id: string) => void;
}

/**
 * Account Details Option 3 — Compact inline chips.
 * Single row: [Debit chip] → [Beneficiary chip] with minimal chrome.
 * Most space-efficient layout.
 */
export function IftAccountDetailsSection3({
  debitAccounts,
  beneficiaries,
  selectedDebitId,
  selectedBeneficiaryId,
  onDebitChange,
  onBeneficiaryChange,
}: Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const arrowColor = useColorModeValue("gray.400", dashColors.pageSubtitle);

  const debitFilterModal = useDisclosure();
  const beneFilterModal = useDisclosure();

  const selectedDebit = debitAccounts.find((a) => a.id === selectedDebitId);
  const selectedBene = beneficiaries.find((b) => b.id === selectedBeneficiaryId);

  const debitItems: AccountItem[] = useMemo(
    () =>
      debitAccounts.map((a) => ({
        id: a.id,
        accountNumber: a.accountNumber,
        accountName: a.accountName,
        currency: a.currency,
        balance: a.balance,
        subtitle: `${a.currency} | ${a.accountName}`,
        isFavorite: a.isFavorite,
        isRecent: a.isRecent,
      })),
    [debitAccounts],
  );

  const beneItems: AccountItem[] = useMemo(
    () =>
      beneficiaries.map((b) => ({
        id: b.id,
        accountNumber: b.iban ?? b.accountNumber,
        accountName: b.name,
        currency: b.countryCode,
        subtitle: `${b.bankName} | ${b.swiftCode}`,
        isFavorite: b.isFavorite,
        isRecent: b.isRecent,
      })),
    [beneficiaries],
  );

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" px={4} py={3} w="full">
      <Flex
        gap={3}
        align="center"
        direction={{ base: "column", md: "row" }}
      >
        {/* Debit Account chip */}
        <Box flex={1} w="full" position="relative">
          <Text fontSize="2xs" color={hintColor} mb={1} fontWeight="medium">
            From
          </Text>
          <Flex gap={2} align="center">
            <Box flex={1} position="relative">
              <IftAccountDropdown
                items={debitItems}
                selectedId={selectedDebitId}
                onSelect={onDebitChange}
                placeholder="Select debit account…"
              />
            </Box>
            <Box
              as="button"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="4px"
              h="36px"
              w="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              bg={fieldBg}
              cursor="pointer"
              color={labelColor}
              _hover={{ borderColor: "accent.linkCta" }}
              onClick={debitFilterModal.onOpen}
            >
              <IconFilter size={16} />
            </Box>
          </Flex>
          {selectedDebit && (
            <Text fontSize="2xs" color={hintColor} mt={0.5} noOfLines={1}>
              {selectedDebit.currency} {selectedDebit.balance.toLocaleString()}
            </Text>
          )}
        </Box>

        {/* Arrow */}
        <Box
          flexShrink={0}
          color={arrowColor}
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          mt={5}
        >
          <IconArrowRight size={18} />
        </Box>

        {/* Beneficiary chip */}
        <Box flex={1} w="full" position="relative">
          <Text fontSize="2xs" color={hintColor} mb={1} fontWeight="medium">
            To
          </Text>
          <Flex gap={2} align="center">
            <Box flex={1} position="relative">
              <IftAccountDropdown
                items={beneItems}
                selectedId={selectedBeneficiaryId}
                onSelect={onBeneficiaryChange}
                placeholder="Select beneficiary…"
              />
            </Box>
            <Box
              as="button"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="4px"
              h="36px"
              w="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              bg={fieldBg}
              cursor="pointer"
              color={labelColor}
              _hover={{ borderColor: "accent.linkCta" }}
              onClick={beneFilterModal.onOpen}
            >
              <IconFilter size={16} />
            </Box>
          </Flex>
          {selectedBene && (
            <Text fontSize="2xs" color={hintColor} mt={0.5} noOfLines={1}>
              {selectedBene.bankName}
            </Text>
          )}
        </Box>
      </Flex>

      {/* Filter Modals */}
      <IftAccountFilterModal
        isOpen={debitFilterModal.isOpen}
        onClose={debitFilterModal.onClose}
        title="Select Debit Account"
        items={debitItems}
        onSelect={onDebitChange}
      />
      <IftAccountFilterModal
        isOpen={beneFilterModal.isOpen}
        onClose={beneFilterModal.onClose}
        title="Select Beneficiary"
        items={beneItems}
        onSelect={onBeneficiaryChange}
      />
    </Box>
  );
}
