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
import { currencyFlagMap } from "@/data/iftPaymentMock";
import type { AccountItem } from "./IftAccountDropdown";

const PAGE_SIZE = 5;

type SortField = "accountName" | "accountNumber" | "currency" | "balance";
type SortDir = "asc" | "desc";

/** Format large numbers with B / M / K suffixes */
function compactAmount(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface IftAccountFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: AccountItem[];
  onSelect: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function IftAccountFilterModal({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
  onToggleFavorite,
}: IftAccountFilterModalProps) {
  const { dashColors } = useFabTokens();
  const modalBg = useColorModeValue("white", dashColors.surfaceBase);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const headerBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const hoverBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const activeBtnBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const favColor = useColorModeValue("#F59E0B", "#FBBF24");

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
    return sortDir === "asc"
      ? <IconArrowUp size={12} />
      : <IconArrowDown size={12} />;
  };

  const filtered = useMemo(() => {
    let result = items;
    if (showFavOnly) result = result.filter((i) => i.isFavorite);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.accountName.toLowerCase().includes(q) ||
          i.accountNumber.includes(q) ||
          (i.subtitle?.toLowerCase().includes(q) ?? false),
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === "balance") {
          cmp = (a.balance ?? 0) - (b.balance ?? 0);
        } else {
          cmp = (a[sortField] ?? "").localeCompare(b[sortField] ?? "");
        }
        return sortDir === "desc" ? -cmp : cmp;
      });
    }
    return result;
  }, [items, search, showFavOnly, sortField, sortDir]);

  /* reset page when filters change */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={modalBg} borderRadius="20px" mx={4}>
        <ModalHeader>
          <Text fontSize="lg" fontWeight="semibold" color={labelColor}>
            {title}
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
                placeholder="Search by name, account number…"
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
          <Flex bg={headerBg} px={4} py={2} borderRadius="md" mb={1}>
            <Box w="36px" flexShrink={0} />
            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("accountName")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>
                Account Name
              </Text>
              <SortIcon field="accountName" />
            </Flex>
            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("accountNumber")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>
                Account Number
              </Text>
              <SortIcon field="accountNumber" />
            </Flex>
            <Flex
              flex={1}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("currency")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>
                Currency
              </Text>
              <SortIcon field="currency" />
            </Flex>
            <Flex
              flex={1}
              align="center"
              gap={1}
              justify="flex-end"
              cursor="pointer"
              onClick={() => handleSort("balance")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>
                Balance
              </Text>
              <SortIcon field="balance" />
            </Flex>
          </Flex>

          {/* Rows */}
          {pageItems.map((item) => (
            <Flex
              key={item.id}
              w="full"
              px={4}
              py={3}
              align="center"
              borderBottomWidth="1px"
              borderColor={borderColor}
              _hover={{ bg: hoverBg }}
              transition="background 0.12s"
              textAlign="left"
            >
              {/* Favorite toggle */}
              <Box
                as="button"
                type="button"
                w="36px"
                flexShrink={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleFavorite?.(item.id);
                }}
                _hover={{ transform: "scale(1.15)" }}
                transition="transform 0.12s"
              >
                {item.isFavorite ? (
                  <IconStarFilled size={16} color={favColor} />
                ) : (
                  <IconStar size={16} color="gray" />
                )}
              </Box>

              {/* Clickable row content */}
              <Flex
                as="button"
                type="button"
                flex={1}
                align="center"
                cursor="pointer"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <Text flex={2} fontSize="sm" color={labelColor} noOfLines={1} textAlign="left">
                  {item.accountName}
                </Text>
                <Text flex={2} fontSize="sm" color={labelColor} noOfLines={1} textAlign="left">
                  {item.accountNumber}
                </Text>
                <Flex flex={1} align="center" gap={1} textAlign="left">
                  <Text fontSize="sm" lineHeight={1}>{currencyFlagMap[item.currency] ?? ""}</Text>
                  <Text fontSize="sm" color={labelColor}>{item.currency}</Text>
                </Flex>
                <Text flex={1} fontSize="sm" color={labelColor} textAlign="right">
                  {item.balance != null ? compactAmount(item.balance) : "—"}
                </Text>
              </Flex>
            </Flex>
          ))}

          {filtered.length === 0 && (
            <Text fontSize="sm" color={hintColor} py={6} textAlign="center">
              No accounts match your search.
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
