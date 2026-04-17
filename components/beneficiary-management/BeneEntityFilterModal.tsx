"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
  ModalFooter,
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
import { beneEntities } from "@/data/beneficiaryMock";

const PAGE_SIZE = 5;

type SortField = "cifName" | "cifCode" | "logicalEntityName" | "country";
type SortDir = "asc" | "desc";

interface BeneEntityFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onChangeSelected: (ids: string[]) => void;
}

export function BeneEntityFilterModal({
  isOpen,
  onClose,
  selectedIds,
  onChangeSelected,
}: BeneEntityFilterModalProps) {
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

  /* local state so user can apply / cancel */
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  /* sync local on open */
  const handleOpen = () => {
    setLocalSelected(selectedIds);
    setSearch("");
    setPage(0);
    setShowFavOnly(false);
    setSortField(null);
    setSortDir("asc");
  };

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

  /* filter + sort */
  const filtered = useMemo(() => {
    let result = [...beneEntities];
    if (showFavOnly) result = result.filter((e) => e.isFavorite);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.cifName.toLowerCase().includes(q) ||
          e.cifCode.includes(q) ||
          e.logicalEntityName.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q),
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

  /* pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const allIds = beneEntities.map((e) => e.id);
  const allSelected = localSelected.length === allIds.length;
  const someSelected = localSelected.length > 0 && !allSelected;

  const toggleAll = () => {
    setLocalSelected(allSelected ? [] : [...allIds]);
  };

  const toggleEntity = (id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    onChangeSelected(localSelected);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      isCentered
      scrollBehavior="inside"
      onCloseComplete={handleOpen}
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={modalBg} borderRadius="20px" mx={4} onAnimationStart={handleOpen}>
        <ModalHeader>
          <Text fontSize="lg" fontWeight="semibold" color={labelColor}>
            Select Entities
          </Text>
        </ModalHeader>
        <ModalCloseButton color={labelColor} />

        <ModalBody pb={4}>
          {/* Search + Favorites toggle */}
          <Flex gap={2} mb={4} align="center">
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none" h="40px">
                <IconSearch size={16} color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search by CIF name, code, entity, country…"
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
            {/* Select-all checkbox */}
            <Box w="32px" flexShrink={0}>
              <Checkbox
                isChecked={allSelected}
                isIndeterminate={someSelected}
                colorScheme="blue"
                size="sm"
                onChange={toggleAll}
              />
            </Box>

            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("cifName")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>CIF Name</Text>
              <SortIcon field="cifName" />
            </Flex>
            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("cifCode")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>CIF Number</Text>
              <SortIcon field="cifCode" />
            </Flex>
            <Flex
              flex={2}
              align="center"
              gap={1}
              cursor="pointer"
              onClick={() => handleSort("logicalEntityName")}
              _hover={{ color: labelColor }}
            >
              <Text fontSize="xs" fontWeight="semibold" color={hintColor}>Entity Name</Text>
              <SortIcon field="logicalEntityName" />
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
          {pageItems.map((entity) => {
            const isChecked = localSelected.includes(entity.id);
            return (
              <Flex
                key={entity.id}
                w="full"
                px={4}
                py={3}
                align="center"
                borderBottomWidth="1px"
                borderColor={borderColor}
                _hover={{ bg: hoverBg }}
                transition="background 0.12s"
                cursor="pointer"
                onClick={() => toggleEntity(entity.id)}
              >
                <Box w="32px" flexShrink={0}>
                  <Checkbox
                    isChecked={isChecked}
                    colorScheme="blue"
                    size="sm"
                    pointerEvents="none"
                  />
                </Box>
                <Text flex={2} fontSize="sm" color={labelColor} noOfLines={1}>
                  {entity.cifName}
                </Text>
                <Text flex={2} fontSize="sm" color={labelColor} noOfLines={1}>
                  {entity.cifCode}
                </Text>
                <Text flex={2} fontSize="sm" color={labelColor} noOfLines={1}>
                  {entity.logicalEntityName}
                </Text>
                <Text flex={1} fontSize="sm" color={labelColor} noOfLines={1}>
                  {entity.country}
                </Text>
              </Flex>
            );
          })}

          {filtered.length === 0 && (
            <Text fontSize="sm" color={hintColor} py={6} textAlign="center">
              No entities match your search.
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

        {/* Footer with Apply / Cancel */}
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Text fontSize="xs" color={hintColor}>
              {localSelected.length} of {allIds.length} selected
            </Text>
            <Button size="sm" variant="outline" borderColor={borderColor} color={labelColor} onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" colorScheme="blue" onClick={handleApply}>
              Apply
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
