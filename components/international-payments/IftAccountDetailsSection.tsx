"use client";

import { useMemo, useState } from "react";
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
import { IftAccountDropdown, type AccountItem } from "./IftAccountDropdown";
import { IftAccountFilterModal } from "./IftAccountFilterModal";

interface IftAccountDetailsSectionProps {
  debitAccounts: IftDebitAccount[];
  beneficiaries: IftBeneficiary[];
  selectedDebitId: string;
  selectedBeneficiaryId: string;
  onDebitChange: (id: string) => void;
  onBeneficiaryChange: (id: string) => void;
}

export function IftAccountDetailsSection({
  debitAccounts,
  beneficiaries,
  selectedDebitId,
  selectedBeneficiaryId,
  onDebitChange,
  onBeneficiaryChange,
}: IftAccountDetailsSectionProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);

  const debitFilterModal = useDisclosure();
  const beneFilterModal = useDisclosure();

  const selectedDebit = debitAccounts.find((a) => a.id === selectedDebitId);

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
    <Box bg={bg} borderRadius="lg" shadow="sm" p={5} w="full">
      <Flex direction="column" gap={3}>
        {/* Debit Account */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Debit Account <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Flex gap={3}>
            <IftAccountDropdown
              items={debitItems}
              selectedId={selectedDebitId}
              onSelect={onDebitChange}
              placeholder="Search by account name or ending digits.."
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
              <IconFilter size={20} />
            </Box>
          </Flex>
          {selectedDebit && (
            <Text fontSize="xs" color={hintColor} mt={1}>
              {selectedDebit.accountName} — Balance: {selectedDebit.currency}{" "}
              {selectedDebit.balance.toLocaleString()}
            </Text>
          )}
          {!selectedDebit && (
            <Text fontSize="xs" color={hintColor} mt={1}>
              Choose the account you want to pay from
            </Text>
          )}
        </FormControl>

        {/* Beneficiary Account */}
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
            Beneficiary Account <Text as="span" color="red.600">*</Text>
          </FormLabel>
          <Flex gap={3}>
            <IftAccountDropdown
              items={beneItems}
              selectedId={selectedBeneficiaryId}
              onSelect={onBeneficiaryChange}
              placeholder="Search by recipient name, IBAN, or account..."
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
              <IconFilter size={20} />
            </Box>
          </Flex>
          <Text fontSize="xs" color={hintColor} mt={1}>
            Choose the account you&apos;re paying to
          </Text>
        </FormControl>
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
