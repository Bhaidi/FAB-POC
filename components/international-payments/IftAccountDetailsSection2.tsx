"use client";

import { useMemo } from "react";

/** Format large numbers with B / M / K suffixes */
function compactAmount(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IconFilter } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftBeneficiary, IftDebitAccount } from "@/data/iftPaymentTypes";
import { iftCountries } from "@/data/iftPaymentMock";
import { IftAccountDropdown, type AccountItem } from "./IftAccountDropdown";
import { IftAccountFilterModal } from "./IftAccountFilterModal";

interface Props {
  debitAccounts: IftDebitAccount[];
  beneficiaries: IftBeneficiary[];
  selectedDebitId: string;
  selectedBeneficiaryId: string;
  onDebitChange: (id: string) => void;
  onBeneficiaryChange: (id: string) => void;
  onToggleDebitFavorite?: (id: string) => void;
  onToggleBeneFavorite?: (id: string) => void;
}

/**
 * Account Details Option 2 — 50 / 50 side-by-side layout.
 * Debit Account on the left, Beneficiary on the right.
 * More compact, single row.
 */
export function IftAccountDetailsSection2({
  debitAccounts,
  beneficiaries,
  selectedDebitId,
  selectedBeneficiaryId,
  onDebitChange,
  onBeneficiaryChange,
  onToggleDebitFavorite,
  onToggleBeneFavorite,
}: Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);

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
        countryCode: a.countryCode,
        subtitle: a.entityName,
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
        currency: iftCountries.find((c) => c.code === b.countryCode)?.currency ?? b.countryCode,
        countryCode: b.countryCode,
        bankName: b.bankName,
        bic: b.swiftCode,
        isFavorite: b.isFavorite,
        isRecent: b.isRecent,
      })),
    [beneficiaries],
  );

  return (
    <Box bg={bg} borderRadius="lg" shadow="sm" px={5} py={4} w="full">
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        {/* Debit Account — left 50% */}
        <FormControl flex={1}>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
            Debit Account <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Flex gap={2}>
            <IftAccountDropdown
              items={debitItems}
              selectedId={selectedDebitId}
              onSelect={onDebitChange}
              placeholder="Search account…"
            />
            <Box
              as="button"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="4px"
              h="40px"
              w="40px"
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
              <IconFilter size={18} />
            </Box>
          </Flex>
          {selectedDebit && (
            <Text fontSize="2xs" color={hintColor} mt={1} noOfLines={1}>
              Available Balance: {selectedDebit.currency}{" "}
              {compactAmount(selectedDebit.balance)}
            </Text>
          )}
        </FormControl>

        {/* Beneficiary — right 50% */}
        <FormControl flex={1}>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor} mb={1}>
            Beneficiary Account <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Flex gap={2}>
            <IftAccountDropdown
              items={beneItems}
              selectedId={selectedBeneficiaryId}
              onSelect={onBeneficiaryChange}
              placeholder="Search beneficiary…"
            />
            <Box
              as="button"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="4px"
              h="40px"
              w="40px"
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
              <IconFilter size={18} />
            </Box>
          </Flex>
          {selectedBene ? (
            <Text fontSize="2xs" color={hintColor} mt={1} noOfLines={1}>
              {selectedBene.name} · {selectedBene.bankName} · {selectedBene.country}
            </Text>
          ) : (
            <Text fontSize="2xs" color={hintColor} mt={1}>
              Recipient account
            </Text>
          )}
        </FormControl>
      </Flex>

      {/* Filter Modals */}
      <IftAccountFilterModal
        isOpen={debitFilterModal.isOpen}
        onClose={debitFilterModal.onClose}
        title="Select Debit Account"
        items={debitItems}
        onSelect={onDebitChange}
        onToggleFavorite={onToggleDebitFavorite}
      />
      <IftAccountFilterModal
        isOpen={beneFilterModal.isOpen}
        onClose={beneFilterModal.onClose}
        title="Select Beneficiary"
        items={beneItems}
        onSelect={onBeneficiaryChange}
        onToggleFavorite={onToggleBeneFavorite}
      />
    </Box>
  );
}
