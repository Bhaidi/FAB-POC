"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { SwiftDirectory } from "@/data/beneficiaryTypes";
import { swiftDirectory } from "@/data/beneficiaryMock";

const PAGE_SIZE = 5;

type SortField = "code" | "bankName" | "city" | "country";
type SortDir = "asc" | "desc";

interface BeneSwiftFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SwiftDirectory) => void;
  selectedCode: string;
}

export function BeneSwiftFilterModal({
  isOpen,
  onClose,
  onSelect,
  selectedCode,
}: BeneSwiftFilterModalProps) {
  const { dashColors } = useFabTokens();
  const modalBg = useColorModeValue("white", "#060d24");
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const headerBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const hoverBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const activeBtnBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const favColor = useColorModeValue("#F59E0B", "#FBBF24");
  const selectedRowBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.12)");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir("asc"); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <IconArrowsSort size={12} color="gray" />;
    return sortDir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />;
  };

  const filtered = useMemo(() => {
    let result = [...swiftDirectory];
    if (showFavOnly) result = result.filter((s) => s.isFavorite);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.bankName.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q),
      );
    }
    if (sortField) {
      result.sort((a, b) => {
        const cmp = (a[sortField] ?? "").localeCompare(b[sortField] ?? "");
        return sortDir === "desc" ? -cmp : cmp;
      });
    }
    return result;
  }, [search, showFavOnly, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={modalBg} borderRadius="20px" mx={4}>
        <ModalHeader>
          <Text fontSize="lg" fontWeight="semibold" color={labelColor}>
            Select SWIFT Code
          </Text>
        </ModalHeader>
        <ModalCloseButton color={labelColor} />

        <ModalBody pb={6}>
          {/* Search + Favorites toggle */}
          <Flex gap={2} mb={4} align="center">
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none" h="40px">
                <IconSearch size={16} color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search by SWIFT code, bank name, city…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                bg={fieldBg}
                borderColor={borderColor}
                color={labelColor}
                fontSize="sm"
                h="40px"
                borderRadius="md"
                _placeholder={{ color: hintColor }}
              />
            </InputGroup>
            <Button
              size="sm"
              h="40px"
              px={4}
              variant={showFavOnly ? "solid" : "outline"}
              colorScheme={showFavOnly ? "yellow" : "gray"}
              leftIcon={showFavOnly ? <IconStarFilled size={14} /> : <IconStar size={14} />}
              onClick={() => { setShowFavOnly((p) => !p); setPage(0); }}
              flexShrink={0}
              fontWeight="medium"
              fontSize="xs"
              borderColor={borderColor}
              color={showFavOnly ? "white" : labelColor}
            >
              Favorites
            </Button>
          </Flex>

          {/* Table header — sortable columns */}
          <Flex bg={headerBg} px={4} py={2} borderRadius="md" mb={1} align="center">
            {/* Fav icon col */}
            <Box w="36px" flexShrink={0} />
            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("code")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>SWIFT Code</Text>
              <SortIcon field="code" />
            </Flex>
            <Flex
              flex={3}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("bankName")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>Bank Name</Text>
              <SortIcon field="bankName" />
            </Flex>
            <Flex
              flex={1}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("city")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>City</Text>
              <SortIcon field="city" />
            </Flex>
            <Flex
              flex={1}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("country")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>Country</Text>
              <SortIcon field="country" />
            </Flex>
          </Flex>

          {/* Table rows */}
          {pageItems.map((item) => {
            const isSelected = item.code === selectedCode;
            return (
              <Flex
                key={item.code}
                as="button"
                type="button"
                w="full"
                px={4}
                py={3}
                align="center"
                borderBottomWidth="1px"
                borderColor={borderColor}
                bg={isSelected ? selectedRowBg : "transparent"}
                _hover={{ bg: isSelected ? selectedRowBg : hoverBg }}
                transition="background 0.12s"
                cursor="pointer"
                onClick={() => { onSelect(item); onClose(); }}
                textAlign="left"
              >
                {/* Favorite star */}
                <Box w="36px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                  {item.isFavorite ? (
                    <IconStarFilled size={16} color={favColor} />
                  ) : (
                    <IconStar size={16} color="gray" />
                  )}
                </Box>
                <Text flex={2} fontSize="sm" fontWeight="medium" color={labelColor} noOfLines={1}>
                  {item.code}
                </Text>
                <Text flex={3} fontSize="sm" color={labelColor} noOfLines={1}>
                  {item.bankName}
                </Text>
                <Text flex={1} fontSize="sm" color={labelColor} noOfLines={1}>
                  {item.city}
                </Text>
                <Text flex={1} fontSize="sm" color={labelColor} noOfLines={1}>
                  {item.country}
                </Text>
              </Flex>
            );
          })}

          {filtered.length === 0 && (
            <Text fontSize="sm" color={hintColor} py={6} textAlign="center">
              No SWIFT codes match your search.
            </Text>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="space-between" align="center" mt={4} pt={3} borderTopWidth="1px" borderColor={borderColor}>
              <Text fontSize="xs" color={hintColor}>
                Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </Text>
              <HStack spacing={1}>
                <IconButton
                  aria-label="Previous page"
                  icon={<IconChevronLeft size={16} />}
                  size="xs"
                  variant="ghost"
                  color={labelColor}
                  isDisabled={safePage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Box
                    key={i}
                    as="button"
                    type="button"
                    w="28px"
                    h="28px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={safePage === i ? "bold" : "normal"}
                    color={safePage === i ? "white" : labelColor}
                    bg={safePage === i ? "accent.linkCta" : "transparent"}
                    _hover={{ bg: safePage === i ? undefined : activeBtnBg }}
                    cursor="pointer"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Box>
                ))}
                <IconButton
                  aria-label="Next page"
                  icon={<IconChevronRight size={16} />}
                  size="xs"
                  variant="ghost"
                  color={labelColor}
                  isDisabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                />
              </HStack>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
