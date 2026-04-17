"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import {
  buildIftSummary,
  iftBeneficiaries,
  iftBeneficiaryPurposes,
  iftChargeOptions,
  iftCountries,
  iftDebitAccounts,
  iftDefaultFormData,
  iftLimitsInfo,
  iftPurposes,
} from "@/data/iftPaymentMock";
import type { IftFormData } from "@/data/iftPaymentTypes";
// Backlog: original stacked layout
// import { IftAccountDetailsSection } from "./IftAccountDetailsSection";
import { IftAccountDetailsSection2 } from "./IftAccountDetailsSection2";
// Backlog: other payment detail variants
// import { IftPaymentDetailsSection } from "./IftPaymentDetailsSection";
// import { IftPaymentDetailsSection2 } from "./IftPaymentDetailsSection2";
// import { IftPaymentDetailsSection3 } from "./IftPaymentDetailsSection3";
// import { IftPaymentDetailsSection4 } from "./IftPaymentDetailsSection4";
import { IftPaymentDetailsSection5 } from "./IftPaymentDetailsSection5";
import { IftIntermediaryBankSection } from "./IftIntermediaryBankSection";
import { IftDocumentsAdviceSection } from "./IftDocumentsAdviceSection";
// Backlog: other summary panel variants
// import { IftPaymentSummaryPanel } from "./IftPaymentSummaryPanel";
// import { IftPaymentSummaryPanel3 } from "./IftPaymentSummaryPanel3";
import { IftPaymentSummaryPanel4 } from "./IftPaymentSummaryPanel4";
// import { IftPaymentSummaryPanel5 } from "./IftPaymentSummaryPanel5";
// import { IftPaymentSummaryPanel6 } from "./IftPaymentSummaryPanel6";
import { IftCountrySelectorModal } from "./IftCountrySelectorModal";
import { IftInvoiceUploadPanel } from "./IftInvoiceUploadPanel";
import { IftReviewSummaryPage } from "./IftReviewSummaryPage";
import { IftTransactionConfirmationPage } from "./IftTransactionConfirmationPage";

export function IftCreatePayment() {
  const [form, setForm] = useState<IftFormData>(iftDefaultFormData);
  const [debitAccounts, setDebitAccounts] = useState(iftDebitAccounts);
  const [beneficiaries, setBeneficiaries] = useState(iftBeneficiaries);
  const [accordionIndex, setAccordionIndex] = useState<number[]>([0, 1]);
  const [showReview, setShowReview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const countryModal = useDisclosure();
  const confirmDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const patch = useCallback((p: Partial<IftFormData>) => {
    setForm((prev) => ({ ...prev, ...p }));
  }, []);

  const summaryRows = useMemo(
    () => buildIftSummary(form, debitAccounts, beneficiaries, iftCountries),
    [form, debitAccounts, beneficiaries],
  );

  /* Filter debit accounts to match the selected ordering country */
  const filteredDebitAccounts = useMemo(() => {
    const country = iftCountries.find((c) => c.code === form.orderingCountry);
    if (!country) return debitAccounts;
    return debitAccounts.filter((a) => a.countryCode === country.code);
  }, [debitAccounts, form.orderingCountry]);

  const toggleDebitFavorite = useCallback((id: string) => {
    setDebitAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a)),
    );
  }, []);

  const toggleBeneFavorite = useCallback((id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)),
    );
  }, []);

  /* ── Theme tokens ─────────────────────────── */
  const { dashColors, dashGradients } = useFabTokens();
  const pageBg = useColorModeValue("neutral.pageBg", dashColors.surfaceBase);
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const cardBorder = useColorModeValue("transparent", dashColors.cardBorder);
  const borderColor = useColorModeValue("neutral.border", dashColors.sectionDivider);
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
  const iconColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const accordionIconColor = useColorModeValue(undefined, dashColors.pageTitle);

  const selectedCountry = iftCountries.find((c) => c.code === form.orderingCountry);

  /* ── Validation ───────────────────────────── */
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!form.debitAccountId) errors.push("Please select a debit account.");
    if (!form.beneficiaryId) errors.push("Please select a beneficiary.");
    if (!form.paymentAmount || Number(form.paymentAmount) <= 0) errors.push("Please enter a valid payment amount.");
    if (!form.paymentDate) errors.push("Please select a payment date.");
    if (!form.purposeOfPayment) errors.push("Please select a purpose of payment.");
    if (!form.chargeType) errors.push("Please select a charge type.");
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

  /* ── Resolved accounts for review ─────────── */
  const debitAccount = debitAccounts.find((a) => a.id === form.debitAccountId);
  const selectedBene = beneficiaries.find((b) => b.id === form.beneficiaryId);

  /* ── Review Page ──────────────────────────── */
  if (showConfirmation) {
    return (
      <IftTransactionConfirmationPage
        form={form}
        debitAccount={debitAccount}
        beneficiary={selectedBene}
        onMakeAnother={() => {
          setShowConfirmation(false);
          setShowReview(false);
          setForm(iftDefaultFormData);
        }}
        onBackToDashboard={() => {
          setShowConfirmation(false);
          setShowReview(false);
        }}
      />
    );
  }

  if (showReview) {
    return (
      <IftReviewSummaryPage
        form={form}
        debitAccount={debitAccount}
        beneficiary={selectedBene}
        summaryRows={summaryRows}
        onBack={() => setShowReview(false)}
        onConfirm={() => {
          setShowConfirmation(true);
        }}
      />
    );
  }

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
              <Text color={breadcrumbText}>New Transfer</Text>
            </HStack>
            <Flex align="center" gap={2} mt={2}>
              <Heading fontSize="xl" fontWeight="medium" color={breadcrumbText}>
                New Transfer
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
          {/* Country + Auto-fill row */}
          <Flex
            gap={4}
            direction={{ base: "column", md: "row" }}
          >
            {/* Ordering Country card */}
            <Box
              bg={cardBg}
              borderRadius="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={cardBorder}
              px={5}
              py={4}
              flex={1}
            >
              <Flex justify="space-between" align="center" gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>Ordering Country</Text>
                  <Text fontSize="xs" color={hintColor} mt={0.5}>
                    Where is this payment originating from?
                  </Text>
                </Box>
                <Flex
                  as="button"
                  align="center"
                  gap={2}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="4px"
                  px={3}
                  h="40px"
                  bg={cardBg}
                  cursor="pointer"
                  flexShrink={0}
                  _hover={{ borderColor: "accent.linkCta" }}
                  onClick={countryModal.onOpen}
                >
                  <Text fontSize="lg" lineHeight={1}>
                    {selectedCountry?.flagEmoji ?? "🌐"}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    {selectedCountry?.name ?? "Select"}
                  </Text>
                  <IconChevronDown size={16} color="gray" />
                </Flex>
              </Flex>
            </Box>

            {/* Auto-fill toggle card */}
            <Box
              bg={cardBg}
              borderRadius="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={cardBorder}
              px={5}
              py={4}
              flex={1}
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
          </Flex>

          {/* Invoice upload panel (visible when toggle ON and no extraction yet) */}
          {form.autoFillEnabled && !form.invoiceExtractedData && (
            <IftInvoiceUploadPanel form={form} onChange={patch} />
          )}

          {/* Show extracted info + accordion when extraction done with auto-fill */}
          {form.autoFillEnabled && form.invoiceExtractedData && (
            <IftInvoiceUploadPanel form={form} onChange={patch} />
          )}

          {/* Accordion sections (shown when autoFill is off, OR when extraction is done) */}
          {(!form.autoFillEnabled || form.invoiceExtractedData) && (
            <Accordion index={accordionIndex} onChange={(idx) => setAccordionIndex(idx as number[])} allowMultiple>
              {/* Account Details */}
              <AccordionItem border="none" mb={2} position="relative" zIndex={10}>
                <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                  <AccordionButton px={5} py={3} borderTopRadius="lg" _hover={{ bg: "transparent" }}>
                    <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                      Account Details
                    </Text>
                    <AccordionIcon color={accordionIconColor} />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={0}>
                    <IftAccountDetailsSection2
                      debitAccounts={filteredDebitAccounts}
                      beneficiaries={beneficiaries}
                      selectedDebitId={form.debitAccountId}
                      selectedBeneficiaryId={form.beneficiaryId}
                      onDebitChange={(id) => {
                        const acct = filteredDebitAccounts.find((a) => a.id === id);
                        patch({ debitAccountId: id, ...(acct ? { debitCurrency: acct.currency } : {}) });
                      }}
                      onBeneficiaryChange={(id) => {
                        const bene = beneficiaries.find((b) => b.id === id);
                        const beneCurrency = bene ? iftCountries.find((c) => c.code === bene.countryCode)?.currency : undefined;
                        patch({ beneficiaryId: id, ...(beneCurrency ? { paymentCurrency: beneCurrency } : {}) });
                      }}
                      onToggleDebitFavorite={toggleDebitFavorite}
                      onToggleBeneFavorite={toggleBeneFavorite}
                    />
                  </AccordionPanel>
                </Box>
              </AccordionItem>

              {/* Payment Details — visible only after both accounts selected */}
              {form.debitAccountId && form.beneficiaryId && (
              <AccordionItem border="none" mb={2}>
                <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="visible">
                  <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                    <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                      Payment Details
                    </Text>
                    <AccordionIcon color={accordionIconColor} />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={0}>
                    <IftPaymentDetailsSection5
                      form={form}
                      purposes={iftPurposes}
                      beneficiaryPurposes={iftBeneficiaryPurposes}
                      chargeOptions={iftChargeOptions}
                      limitsInfo={iftLimitsInfo}
                      onChange={patch}
                    />
                  </AccordionPanel>
                </Box>
              </AccordionItem>
              )}

              {/* Intermediary Bank Details — visible only after both accounts selected */}
              {form.debitAccountId && form.beneficiaryId && (
              <AccordionItem border="none" mb={2}>
                <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="hidden">
                  <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                    <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                      Intermediary Bank Details
                      <Text as="span" fontSize="2xs" fontWeight="normal" color={hintColor} ml={2}>
                        (Optional)
                      </Text>
                    </Text>
                    <AccordionIcon color={accordionIconColor} />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={0}>
                    <IftIntermediaryBankSection
                      form={form}
                      countries={iftCountries}
                      onChange={patch}
                    />
                  </AccordionPanel>
                </Box>
              </AccordionItem>
              )}

              {/* Documents & Advice — visible only after both accounts selected */}
              {form.debitAccountId && form.beneficiaryId && (
              <AccordionItem border="none" mb={2}>
                <Box bg={cardBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={cardBorder} overflow="hidden">
                  <AccordionButton px={5} py={3} _hover={{ bg: "transparent" }}>
                    <Text flex={1} textAlign="left" fontSize="md" fontWeight="medium" color={labelColor}>
                      Documents &amp; Advice
                      <Text as="span" fontSize="2xs" fontWeight="normal" color={hintColor} ml={2}>
                        (Optional)
                      </Text>
                    </Text>
                    <AccordionIcon color={accordionIconColor} />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={0}>
                    <IftDocumentsAdviceSection form={form} onChange={patch} />
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
          <Flex direction="column" gap={4}>
            <IftPaymentSummaryPanel4 rows={summaryRows} />
            {/* Backlog: other summary panel variants
            <IftPaymentSummaryPanel rows={summaryRows} />
            <IftPaymentSummaryPanel3 rows={summaryRows} />
            <IftPaymentSummaryPanel5 rows={summaryRows} />
            <IftPaymentSummaryPanel6 rows={summaryRows} />
            */}
          </Flex>
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
            isDisabled={!form.debitAccountId || !form.beneficiaryId}
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

      {/* ── Country Selector Modal ────────────── */}
      <IftCountrySelectorModal
        isOpen={countryModal.isOpen}
        onClose={countryModal.onClose}
        countries={iftCountries}
        selectedCode={form.orderingCountry}
        onSelect={(code) => {
          const country = iftCountries.find((c) => c.code === code);
          patch({ orderingCountry: code, orderingCurrency: country?.currency ?? form.orderingCurrency });
        }}
      />

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
              Are you sure you want to proceed? Please ensure all details are correct before reviewing.
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
