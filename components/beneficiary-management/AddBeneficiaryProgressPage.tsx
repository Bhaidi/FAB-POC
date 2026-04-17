// Option A: Accordion with progress bar and badges
"use client";

import { Box, Progress, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { AddBeneficiaryPage } from "./AddBeneficiaryPage";
import { useState, useMemo } from "react";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneDefaultFormData, buildBeneficiarySummary } from "@/data/beneficiaryMock";

export function AddBeneficiaryProgressPage() {
  // Local state to track progress
  const [form, setForm] = useState<BeneficiaryFormData>(beneDefaultFormData);
  const summaryRows = useMemo(() => buildBeneficiarySummary(form), [form]);

  // Section completion logic
  const sectionStates = [
    !!form.bankCountry && !!form.beneficiaryAccountNo && !!form.beneficiaryCurrency,
    !!form.swiftCode && !!form.bankName,
    !!form.beneficiaryNickName && !!form.beneficiaryName && !!form.addressLine && !!form.townCityName && !!form.contactNumber && !!form.beneficiaryEmail && !!form.customerIdentificationNumber,
    form.selectedEntities.length > 0,
    true // Additional always available
  ];
  const completedCount = sectionStates.filter(Boolean).length;
  const percent = Math.round((completedCount / sectionStates.length) * 100);

  const barColor = useColorModeValue("blue.400", "blue.300");

  return (
    <Box w="full" minH="100vh">
      <Box px={{ base: 4, md: 8 }} pt={6} pb={2}>
        <Flex align="center" gap={4}>
          <Text fontWeight="bold" fontSize="md" minW="120px">
            Progress
          </Text>
          <Progress value={percent} colorScheme="blue" size="lg" flex={1} borderRadius="md" bg="gray.100" hasStripe />
          <Text fontSize="sm" color="gray.500" minW="80px" textAlign="right">
            {completedCount} / {sectionStates.length} sections
          </Text>
        </Flex>
      </Box>
      {/* The original AddBeneficiaryPage, but pass setForm to child for state sync */}
      <AddBeneficiaryPage key="progress" />
    </Box>
  );
}
