// Option B: Wizard stepper flow
"use client";

import {
  Box,
  Button,
  Flex,
  Step,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneDefaultFormData } from "@/data/beneficiaryMock";
import { BeneAccountDetailsSection } from "./BeneAccountDetailsSection";
import { BeneBankDetailsSection } from "./BeneBankDetailsSection";
import { BeneDetailsSection } from "./BeneDetailsSection";
import { BeneEntitySection } from "./BeneEntitySection";
import { BeneAdditionalSection } from "./BeneAdditionalSection";

const steps = [
  { title: "Account Details" },
  { title: "Bank Details" },
  { title: "Personal Details" },
  { title: "Entity" },
  { title: "Additional" },
];

export function AddBeneficiaryWizardPage() {
  const [form, setForm] = useState<BeneficiaryFormData>(beneDefaultFormData);
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({ index: 0, count: steps.length });
  const cardBg = useColorModeValue("white", "#060d24");
  const cardBorder = useColorModeValue("transparent", "#232a3a");

  // Section validation logic
  const sectionValid = [
    !!form.bankCountry && !!form.beneficiaryAccountNo && !!form.beneficiaryCurrency,
    !!form.swiftCode && !!form.bankName,
    !!form.beneficiaryNickName && !!form.beneficiaryName && !!form.addressLine && !!form.townCityName && !!form.contactNumber && !!form.beneficiaryEmail && !!form.customerIdentificationNumber,
    form.selectedEntities.length > 0,
    true,
  ];

  return (
    <Flex direction="column" minH="100vh" w="full" align="center" bg={useColorModeValue("gray.50", "#060d24")}
      px={{ base: 2, md: 0 }} py={8}>
      <Stepper size="lg" colorScheme="blue" index={activeStep} w={{ base: "100%", md: "700px" }}>
        {steps.map((step, index) => (
          <Step key={step.title}>
            <StepIndicator>
              <StepStatus complete={<StepNumber />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
            <StepTitle>{step.title}</StepTitle>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Box
        mt={8}
        w={{ base: "100%", md: "700px" }}
        bg={cardBg}
        borderRadius="lg"
        shadow="sm"
        borderWidth="1px"
        borderColor={cardBorder}
        px={6}
        py={8}
      >
        {activeStep === 0 && <BeneAccountDetailsSection form={form} onChange={setForm} />}
        {activeStep === 1 && <BeneBankDetailsSection form={form} onChange={setForm} />}
        {activeStep === 2 && <BeneDetailsSection form={form} onChange={setForm} />}
        {activeStep === 3 && <BeneEntitySection form={form} onChange={setForm} />}
        {activeStep === 4 && <BeneAdditionalSection form={form} onChange={setForm} />}
        <Flex mt={8} gap={4} justify="space-between">
          <Button onClick={goToPrevious} isDisabled={activeStep === 0} variant="outline" colorScheme="blue">
            Back
          </Button>
          <Button
            onClick={goToNext}
            colorScheme="blue"
            isDisabled={!sectionValid[activeStep] || activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
