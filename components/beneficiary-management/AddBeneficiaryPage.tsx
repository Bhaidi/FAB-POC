"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import {
  IconChevronDown,
  IconChevronLeft,
  IconInfoCircle,
} from "@tabler/icons-react";
import { AuthFooter } from "@/components/auth/AuthFooter";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneDefaultFormData, buildBeneficiarySummary } from "@/data/beneficiaryMock";
import { IftInvoiceUploadPanel } from "@/components/international-payments/IftInvoiceUploadPanel";
import { BeneAccountDetailsSection } from "./BeneAccountDetailsSection";
import { BeneBankDetailsSection } from "./BeneBankDetailsSection";
import { BeneDetailsSection } from "./BeneDetailsSection";
import { BeneEntitySection } from "./BeneEntitySection";
import { BeneAdditionalSection } from "./BeneAdditionalSection";
import { BeneSummaryPanel } from "./BeneSummaryPanel";
import { BeneReviewPage } from "./BeneReviewPage";
import { BeneConfirmationPage } from "./BeneConfirmationPage";

export function AddBeneficiaryPage() {
  const [form, setForm] = useState<BeneficiaryFormData>(beneDefaultFormData);
  const [accordionIndex, setAccordionIndex] = useState<number[]>([0]);
  const [showReview, setShowReview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const confirmDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const patch = useCallback((p: Partial<BeneficiaryFormData>) => {
    setForm((prev) => ({ ...prev, ...p }));
  }, []);

  const summaryRows = useMemo(
    () => buildBeneficiarySummary(form),
    [form],
  );

  /* ── Auto-open next accordion section ──── */
  // When currency is selected → open Bank Details (index 1)
  useEffect(() => {
    if (form.beneficiaryCurrency && form.accountLookupDone) {
      setAccordionIndex((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    }
  }, [form.beneficiaryCurrency, form.accountLookupDone]);

  // When SWIFT code is filled → open Beneficiary Details (index 2)
  useEffect(() => {
    if (form.swiftCode && form.bankName) {
      setAccordionIndex((prev) => (prev.includes(2) ? prev : [...prev, 2]));
    }
  }, [form.swiftCode, form.bankName]);

  /* ── Theme tokens ─────────────────────────── */
  const { dashColors, dashGradients } = useFabTokens();
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const cardBorder = useColorModeValue("transparent", dashColors.cardBorder);
  const headerBg = useColorModeValue("neutral.pageBg", "#060d24");
  const headerBorderColor = useColorModeValue("#d7d7d7", dashColors.sectionDivider);
  const breadcrumbLink = useColorModeValue("accent.linkCta", "#60A5FA");
  const breadcrumbText = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const footerBg = useColorModeValue("white", "#060d24");
  const menuBg = useColorModeValue("white", "#060d24");
  const menuHoverBg = useColorModeValue("gray.100", "#0a1433");
  const footerBorder = useColorModeValue("rgba(168,172,178,0.4)", dashColors.sectionDivider);
  const accordionIconColor = useColorModeValue(undefined, dashColors.pageTitle);

  /* ── Validation ───────────────────────────── */
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!form.bankCountry) errors.push("Please select a bank country.");
    if (!form.beneficiaryAccountNo) errors.push("Please enter beneficiary account / IBAN.");
    if (!form.accountLookupDone) errors.push("Please wait for account lookup to complete.");
    if (!form.beneficiaryCurrency) errors.push("Please select beneficiary currency.");
    if (!form.isFabAccount && !form.swiftCode) errors.push("Please select a SWIFT code.");
    if (!form.beneficiaryNickName) errors.push("Please enter beneficiary nick name.");
    if (!form.beneficiaryName) errors.push("Please enter beneficiary name.");
    if (!form.addressLine) errors.push("Please enter address line.");
    if (!form.townCityName) errors.push("Please enter town/city name.");
    if (!form.contactNumber) errors.push("Please enter contact number.");
    if (!form.beneficiaryEmail) errors.push("Please enter beneficiary email.");
    if (!form.customerIdentificationNumber) errors.push("Please enter customer identification number.");
    if (form.selectedEntities.length === 0) errors.push("Please select at least one entity.");
    return errors;
  }, [form]);

  const handleReviewClick = useCallback(() => {
    if (validationErrors.length > 0) {
      toast({
        title: "Missing required fields",
        description: validationErrors[0],
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    confirmDialog.onOpen();
  }, [validationErrors, toast, confirmDialog]);

  const handleConfirmProceed = useCallback(() => {
    confirmDialog.onClose();
    setShowReview(true);
  }, [confirmDialog]);

  /* Whether to show the accordion sections below account details */
  const showBelowSections = form.accountLookupDone && (form.isFabAccount || form.beneficiaryCurrency);

  /* ── Confirmation Page ─────────────────────── */
  if (showConfirmation) {
    return (
      <BeneConfirmationPage
        form={form}
        onMakeAnother={() => {
          setShowConfirmation(false);
          setShowReview(false);
          setForm(beneDefaultFormData);
        }}
        onBackToDashboard={() => {
          setShowConfirmation(false);
          setShowReview(false);
        }}
      />
    );
  }

  /* ── Review Page ───────────────────────────── */
  if (showReview) {
    return (
      <BeneReviewPage
        form={form}
        summaryRows={summaryRows}
        onBack={() => setShowReview(false)}
        onConfirm={() => setShowConfirmation(true)}
      />
    );
  }

  /* ── Patch adapter for invoice panel (IFT form shape → bene form shape) */
  const invoicePatch = useCallback(
    (p: Record<string, unknown>) => {
      const mapped: Partial<BeneficiaryFormData> = {};
      if ("autoFillEnabled" in p) mapped.autoFillEnabled = p.autoFillEnabled as boolean;
      if ("uploadedFileName" in p) mapped.uploadedFileName = p.uploadedFileName as string | undefined;
      if ("invoiceExtractedData" in p) mapped.invoiceExtractedData = p.invoiceExtractedData as Record<string, string> | undefined;
      patch(mapped);
    },
    [patch],
  );

  /* Build a minimal IFT-shaped form for the invoice panel */
  const invoiceFormCompat = {
    autoFillEnabled: form.autoFillEnabled,
    uploadedFileName: form.uploadedFileName,
    invoiceExtractedData: form.invoiceExtractedData as never,
  };

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("transparent", dashColors.surfaceBase)} bgImage={useColorModeValue("none", dashGradients.canvas)}>
      {/* ── Top Header / Breadcrumb ────────────── */}
      <Box
        bg={headerBg}
        borderBottomWidth="1px"
        borderColor={headerBorderColor}
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="start" gap={3}>
          <Box
            as="button"
            borderRadius="sm"
            shadow="sm"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            cursor="pointer"
            color={labelColor}
          >
            <IconChevronLeft size={16} />
          </Box>
          <Box>
            <HStack spacing={1.5} fontSize="xs">
              <Text color={breadcrumbLink} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                Home
              </Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbLink} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                Payments
              </Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbLink} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                Beneficiary Management
              </Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbText}>Add New Beneficiary</Text>
            </HStack>
            <Flex align="center" gap={2} mt={2}>
              <Heading fontSize="xl" fontWeight="medium" color={breadcrumbText}>
                New Beneficiary
              </Heading>
              <IconInfoCircle size={18} color="gray" />
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* ── Main Content ──────────────────────── */}
      <Flex
        flex={1}
        gap={4}
        mt="10px"
        mb={10}
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        maxW="1400px"
        mx="auto"
        w="full"
      >
        {/* Left column — Form */}
        <Flex direction="column" gap={4} flex={1} minW={0}>
          {/* Auto-fill toggle card */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            shadow="sm"
            borderWidth="1px"
            borderColor={cardBorder}
            px={5}
            py={4}
          >
            <Flex justify="space-between" align="center" gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                  Upload Invoice to Auto-fill
                </Text>
                <Text fontSize="xs" color={hintColor} mt={0.5}>
                  Upload your invoice or bill to automatically populate the transfer details.
                </Text>
              </Box>
              <Flex align="center" gap={2} flexShrink={0}>
                <Switch
                  isChecked={form.autoFillEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    patch({
                      autoFillEnabled: checked,
                      ...(!checked ? { uploadedFileName: undefined, invoiceExtractedData: undefined } : {}),
                    });
                  }}
                  colorScheme="blue"
                  size="md"
                />
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={form.autoFillEnabled ? hintColor : "accent.linkCta"}
                  minW="42px"
                  textAlign="center"
                >
                  {form.autoFillEnabled ? "Auto" : "Manual"}
                </Text>
              </Flex>
            </Flex>
          </Box>

          {/* Invoice upload panel */}
          {form.autoFillEnabled && (
            <IftInvoiceUploadPanel form={invoiceFormCompat as never} onChange={invoicePatch as never} />
          )}

          {/* Accordion sections */}
          {(!form.autoFillEnabled || form.invoiceExtractedData) && (
            <Accordion index={accordionIndex} onChange={(idx) => setAccordionIndex(idx as number[])} allowMultiple>
              {/* Beneficiary Details (Account) */}
              <AccordionItem border="none" mb={2} position="relative" zIndex={10}>
                <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                  <AccordionButton px={5} py={3} borderTopRadius="lg" _hover={{ bg: "transparent" }}>
                    <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                      Beneficiary Details
                    </Text>
                    <AccordionIcon color={accordionIconColor} />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={0}>
                    <BeneAccountDetailsSection form={form} onChange={patch} />
                  </AccordionPanel>
                </Box>
              </AccordionItem>

              {/* Bank Details — visible after lookup */}
              {showBelowSections && (
                <AccordionItem border="none" mb={2} position="relative" zIndex={9}>
                  <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                    <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                      <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                        Bank Details
                      </Text>
                      <AccordionIcon color={accordionIconColor} />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={0}>
                      <BeneBankDetailsSection form={form} onChange={patch} />
                    </AccordionPanel>
                  </Box>
                </AccordionItem>
              )}

              {/* Beneficiary Details (Personal) */}
              {showBelowSections && (
                <AccordionItem border="none" mb={2}>
                  <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                    <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                      <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                        Beneficiary Details
                      </Text>
                      <AccordionIcon color={accordionIconColor} />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={0}>
                      <BeneDetailsSection form={form} onChange={patch} />
                    </AccordionPanel>
                  </Box>
                </AccordionItem>
              )}

              {/* Entity */}
              {showBelowSections && (
                <AccordionItem border="none" mb={2} position="relative" zIndex={8}>
                  <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                    <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                      <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                        Entity
                      </Text>
                      <AccordionIcon color={accordionIconColor} />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={0}>
                      <BeneEntitySection form={form} onChange={patch} />
                    </AccordionPanel>
                  </Box>
                </AccordionItem>
              )}

              {/* Additional Details */}
              {showBelowSections && (
                <AccordionItem border="none" mb={2}>
                  <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="hidden">
                    <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                      <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                        Additional Details
                      </Text>
                      <AccordionIcon color={accordionIconColor} />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={0}>
                      <BeneAdditionalSection form={form} onChange={patch} />
                    </AccordionPanel>
                  </Box>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </Flex>

        {/* Right column — Summary */}
        <Box
          w={{ base: "full", lg: "320px" }}
          flexShrink={0}
          position={{ base: "relative", lg: "sticky" }}
          top={{ lg: "100px" }}
        >
          <BeneSummaryPanel rows={summaryRows} />
        </Box>
      </Flex>

      {/* ── Footer Action Bar ──────────────────── */}
      <Box
        bg={footerBg}
        borderTopWidth="1px"
        borderColor={footerBorder}
        shadow="0px -2px 8px rgba(0,0,0,0.08)"
        px={{ base: 4, md: 6 }}
        py={4}
        position="sticky"
        bottom={0}
        zIndex={10}
      >
        <Flex justify="flex-end" gap={4} maxW="1400px" mx="auto" flexWrap="wrap">
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              borderColor="accent.linkCta"
              color="accent.linkCta"
              borderRadius="sm"
              fontWeight="medium"
              fontSize="sm"
              rightIcon={<IconChevronDown size={16} />}
              _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
            >
              Save As
            </MenuButton>
            <MenuList bg={menuBg} borderColor={cardBorder}>
              <MenuItem fontSize="sm" bg={menuBg} _hover={{ bg: menuHoverBg }}>Save as Draft</MenuItem>
              <MenuItem fontSize="sm" bg={menuBg} _hover={{ bg: menuHoverBg }}>Save as Template</MenuItem>
            </MenuList>
          </Menu>

          <Button
            variant="outline"
            borderColor="accent.linkCta"
            color="accent.linkCta"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            w={{ base: "full", md: "120px" }}
            _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
          >
            Cancel
          </Button>

          <Button
            bg="accent.linkCta"
            color="white"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            w={{ base: "full", md: "auto" }}
            px={6}
            isDisabled={!form.bankCountry || !form.beneficiaryAccountNo}
            _hover={{ bg: "blue.600" }}
            _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            onClick={handleReviewClick}
          >
            Review &amp; Confirm
          </Button>
        </Flex>
      </Box>

      {/* ── Legal Footer ──────────────────────── */}
      <AuthFooter />

      {/* ── Confirmation Dialog ────────────────── */}
      <AlertDialog
        isOpen={confirmDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={confirmDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="lg">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Proceed to Review?
            </AlertDialogHeader>
            <AlertDialogBody fontSize="sm">
              Are you sure you want to proceed? Please ensure all beneficiary details are correct before reviewing.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} variant="outline" onClick={confirmDialog.onClose} borderRadius="sm" fontSize="sm">
                No, Go Back
              </Button>
              <Button bg="accent.linkCta" color="white" onClick={handleConfirmProceed} borderRadius="sm" fontSize="sm" _hover={{ bg: "blue.600" }}>
                Yes, Proceed
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
