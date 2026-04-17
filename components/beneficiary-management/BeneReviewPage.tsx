"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useClipboard,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  IconChevronLeft,
  IconCopy,
  IconCreditCard,
  IconBuildingBank,
  IconUser,
  IconWorld,
  IconFileText,
  IconDownload,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData, BeneSummaryRow } from "@/data/beneficiaryTypes";
import { beneEntities, beneCountries } from "@/data/beneficiaryMock";
import type { IftCountry } from "@/data/iftPaymentTypes";

interface BeneReviewPageProps {
  form: BeneficiaryFormData;
  summaryRows: BeneSummaryRow[];
  onBack: () => void;
  onConfirm: () => void;
}

/* ── Row component ───────────────────────────── */
function R({ l, v, highlight }: { l: string; v: string; highlight?: boolean }) {
  const { dashColors } = useFabTokens();
  const lc = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const vc = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hlBg = useColorModeValue("blue.50", "rgba(0,98,255,0.06)");

  return (
    <Flex
      py={1.5}
      px={3}
      justify="space-between"
      align="flex-start"
      bg={highlight ? hlBg : "transparent"}
      borderRadius="sm"
    >
      <Text fontSize="xs" color={lc} flex="0 0 44%">
        {l}
      </Text>
      <Text fontSize="xs" fontWeight="semibold" color={vc} textAlign="right" wordBreak="break-all">
        {v || "—"}
      </Text>
    </Flex>
  );
}

/* ── Section wrapper ─────────────────────────── */
function Section({
  title,
  icon,
  accentColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const bd = useColorModeValue("transparent", dashColors.cardBorder);
  const lc = useColorModeValue("neutral.mainText", dashColors.pageTitle);

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={bd}
      borderRadius="lg"
      overflow="hidden"
      borderLeftWidth="3px"
      borderLeftColor={accentColor}
    >
      <Flex align="center" gap={2} px={4} pt={3} pb={1.5}>
        {icon}
        <Text fontSize="sm" fontWeight="semibold" color={lc}>
          {title}
        </Text>
      </Flex>
      <Box px={1} pb={3}>
        {children}
      </Box>
    </Box>
  );
}

export function BeneReviewPage({
  form,
  summaryRows,
  onBack,
  onConfirm,
}: BeneReviewPageProps) {
  const { dashColors, dashGradients } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerBorderColor = useColorModeValue("#d7d7d7", dashColors.sectionDivider);
  const breadcrumbLink = useColorModeValue("accent.linkCta", "#60A5FA");
  const breadcrumbText = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const footerBg = useColorModeValue("white", "#060d24");
  const footerBorder = useColorModeValue("rgba(168,172,178,0.4)", dashColors.sectionDivider);
  const bd = useColorModeValue("transparent", dashColors.cardBorder);

  const refNo = "BEN-2026-04170001";
  const { hasCopied, onCopy } = useClipboard(refNo);

  const country = beneCountries.find((c: IftCountry) => c.code === form.bankCountry);
  const entityNames =
    form.selectedEntities.length === beneEntities.length
      ? "All"
      : form.selectedEntities
          .map((id) => beneEntities.find((e) => e.id === id)?.cifName)
          .filter(Boolean)
          .join(", ");

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("transparent", dashColors.surfaceBase)} bgImage={useColorModeValue("none", dashGradients.canvas)}>
      {/* Header */}
      <Box
        bg={useColorModeValue("neutral.pageBg", "#060d24")}
        borderBottomWidth="1px"
        borderColor={headerBorderColor}
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="start" gap={3}>
          <Box as="button" p={2} cursor="pointer" color={labelColor} onClick={onBack}>
            <IconChevronLeft size={16} />
          </Box>
          <Box>
            <HStack spacing={1.5} fontSize="xs">
              <Text color={breadcrumbLink}>Home</Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbLink}>Beneficiary Management</Text>
              <Text color={breadcrumbText}>/</Text>
              <Text color={breadcrumbText}>Review</Text>
            </HStack>
            <Heading fontSize="xl" fontWeight="medium" color={breadcrumbText} mt={2}>
              Review Beneficiary
            </Heading>
          </Box>
        </Flex>
      </Box>

      {/* Ref banner */}
      <Box mx="auto" maxW="900px" w="full" mt={4} px={{ base: 4, md: 0 }}>
        <Flex
          bg={useColorModeValue("blue.50", "rgba(0,98,255,0.08)")}
          borderWidth="1px"
          borderColor={useColorModeValue("blue.200", "rgba(0,98,255,0.2)")}
          borderRadius="lg"
          px={5}
          py={3}
          align="center"
          justify="space-between"
        >
          <Box>
            <Text fontSize="2xs" color={useColorModeValue("blue.500", "#60A5FA")} letterSpacing="wider" fontWeight="semibold">
              REFERENCE NUMBER
            </Text>
            <Text fontSize="md" fontWeight="bold" color={useColorModeValue("blue.700", "#93C5FD")} mt={0.5}>
              {refNo}
            </Text>
          </Box>
          <Tooltip label={hasCopied ? "Copied!" : "Copy"} hasArrow>
            <Box as="button" onClick={onCopy} p={2} cursor="pointer" color={useColorModeValue("blue.500", "#60A5FA")}>
              <IconCopy size={18} />
            </Box>
          </Tooltip>
        </Flex>
      </Box>

      {/* Content */}
      <Box mx="auto" maxW="900px" w="full" mt={4} mb={10} px={{ base: 4, md: 0 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Left column */}
          <Flex direction="column" gap={4}>
            <Section title="Account Details" icon={<IconCreditCard size={15} />} accentColor="blue.400">
              <R l="Bank Country" v={country ? `${country.flagEmoji} ${country.name}` : ""} />
              <R l="Account No / IBAN" v={form.beneficiaryAccountNo} highlight />
              <R l="Account Type" v={form.isFabAccount ? "FAB Account" : "Non-FAB Account"} />
              <R l="Currency" v={form.beneficiaryCurrency} />
            </Section>

            <Section title="Bank Details" icon={<IconBuildingBank size={15} />} accentColor="green.400">
              <R l="SWIFT Code" v={form.swiftCode} highlight />
              <R l="Bank Name" v={form.bankName} />
              <R l="Branch" v={form.branchName} />
              <R l="Bank Address" v={form.beneficiaryBankAddress} />
              <R l="City" v={form.bankCity} />
              <R l="Routing Code" v={form.routingCode} />
            </Section>
          </Flex>

          {/* Right column */}
          <Flex direction="column" gap={4}>
            <Section title="Beneficiary Details" icon={<IconUser size={15} />} accentColor="purple.400">
              <R l="Nick Name" v={form.beneficiaryNickName} />
              <R l="Full Name" v={form.beneficiaryName} highlight />
              <R l="Address" v={form.addressLine} />
              <R l="City" v={form.townCityName} />
              <R l="Country Subdivision" v={form.countrySubdivision} />
              <R l="Postal Code" v={form.postalZipCode} />
              <R l="Contact" v={`${form.contactCountryCode} ${form.contactNumber}`} />
              <R l="Email" v={form.beneficiaryEmail} />
              <R l="Customer ID" v={form.customerIdentificationNumber} />
            </Section>

            <Section title="Entity & Additional" icon={<IconWorld size={15} />} accentColor="orange.400">
              <R l="Entities" v={entityNames} highlight />
              {form.intermediarySwiftCode && <R l="Intermediary SWIFT" v={form.intermediarySwiftCode} />}
              {form.intermediaryBankName && <R l="Intermediary Bank" v={form.intermediaryBankName} />}
              {form.intermediaryCountry && <R l="Intermediary Country" v={form.intermediaryCountry} />}
            </Section>
          </Flex>
        </SimpleGrid>
      </Box>

      {/* Footer */}
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
        <Flex justify="flex-end" gap={4} maxW="900px" mx="auto" flexWrap="wrap">
          <Button
            variant="ghost"
            leftIcon={<IconDownload size={16} />}
            color="accent.linkCta"
            fontSize="sm"
            fontWeight="medium"
          >
            Download
          </Button>
          <Button
            variant="outline"
            borderColor="accent.linkCta"
            color="accent.linkCta"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            onClick={onBack}
          >
            Edit
          </Button>
          <Button
            bg="accent.linkCta"
            color="white"
            borderRadius="sm"
            fontWeight="medium"
            fontSize="sm"
            px={6}
            _hover={{ bg: "blue.600" }}
            onClick={onConfirm}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
