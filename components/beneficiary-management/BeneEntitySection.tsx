"use client";

import { useMemo, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  useOutsideClick,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneficiaryFormData } from "@/data/beneficiaryTypes";
import { beneEntities } from "@/data/beneficiaryMock";
import { BeneEntityFilterModal } from "./BeneEntityFilterModal";

/* ── helpers ─────────────────────────────────── */
function entityLabel(e: { cifName: string; cifCode: string; logicalEntityName: string; country: string }) {
  return `${e.cifName} | ${e.cifCode} | ${e.logicalEntityName} | ${e.country}`;
}

/* ── component ────────────────────────────────── */
interface BeneEntitySectionProps {
  form: BeneficiaryFormData;
  onChange: (patch: Partial<BeneficiaryFormData>) => void;
}

export function BeneEntitySection({ form, onChange }: BeneEntitySectionProps) {
  const { dashColors } = useFabTokens();
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const panelBg = useColorModeValue("white", "#060d24");
  const hoverBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const allHighlight = useColorModeValue("blue.50", "rgba(0,98,255,0.12)");

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterModal = useDisclosure();

  useOutsideClick({ ref: containerRef, handler: () => { setOpen(false); setSearch(""); } });

  const allIds = beneEntities.map((e) => e.id);
  const allSelected = form.selectedEntities.length === allIds.length;

  /* filtered list based on search */
  const filtered = useMemo(() => {
    if (!search.trim()) return beneEntities;
    const q = search.toLowerCase();
    return beneEntities.filter(
      (e) =>
        e.cifName.toLowerCase().includes(q) ||
        e.cifCode.includes(q) ||
        e.logicalEntityName.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q),
    );
  }, [search]);

  const toggleEntity = (id: string) => {
    const next = form.selectedEntities.includes(id)
      ? form.selectedEntities.filter((x) => x !== id)
      : [...form.selectedEntities, id];
    onChange({ selectedEntities: next });
  };

  const toggleAll = () => {
    onChange({ selectedEntities: allSelected ? [] : [...allIds] });
  };

  const removeEntity = (id: string) => {
    onChange({ selectedEntities: form.selectedEntities.filter((x) => x !== id) });
  };

  return (
    <Box p={5} w="full">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      <FormControl isRequired>
        <FormLabel fontSize="xs" fontWeight="medium" color={labelColor}>
          Entities
        </FormLabel>

        {/* Selected tags */}
        {form.selectedEntities.length > 0 && (
          <Wrap spacing={1.5} mb={2}>
            {allSelected ? (
              <WrapItem>
                <Tag size="sm" colorScheme="blue" borderRadius="full" variant="subtle">
                  <TagLabel>All ({allIds.length})</TagLabel>
                  <TagCloseButton onClick={() => onChange({ selectedEntities: [] })} />
                </Tag>
              </WrapItem>
            ) : (
              form.selectedEntities.map((id) => {
                const ent = beneEntities.find((e) => e.id === id);
                if (!ent) return null;
                return (
                  <WrapItem key={id}>
                    <Tag size="sm" colorScheme="blue" borderRadius="full" variant="subtle">
                      <TagLabel>{ent.cifName} | {ent.cifCode}</TagLabel>
                      <TagCloseButton onClick={() => removeEntity(id)} />
                    </Tag>
                  </WrapItem>
                );
              })
            )}
          </Wrap>
        )}

        {/* Search input with filter icon */}
        <Box ref={containerRef} position="relative">
          <InputGroup size="md">
            <Input
              ref={inputRef}
              h="40px"
              bg={fieldBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="4px"
              px={3}
              pr="72px"
              fontSize="sm"
              color={labelColor}
              placeholder="Search entities…"
              _placeholder={{ color: hintColor }}
              _hover={{ borderColor: "accent.linkCta" }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              autoComplete="off"
            />
            <InputRightElement w="72px" h="40px" pr={1}>
              <Flex align="center" gap={0.5}>
                <IconSearch size={15} color="gray" />
                <IconButton
                  aria-label="Open entity filter"
                  icon={<IconFilter size={16} />}
                  variant="ghost"
                  size="xs"
                  color={hintColor}
                  _hover={{ color: labelColor }}
                  onClick={() => filterModal.onOpen()}
                />
              </Flex>
            </InputRightElement>
          </InputGroup>

          {/* Dropdown panel */}
          {open && (
            <Box
              position="absolute"
              top="44px"
              left={0}
              right={0}
              zIndex={1400}
              bg={panelBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              shadow="lg"
              maxH="320px"
              overflowY="auto"
            >
              {/* All toggle row */}
              <Flex
                as="button"
                type="button"
                w="full"
                px={4}
                py={2.5}
                align="center"
                gap={3}
                cursor="pointer"
                bg={allSelected ? allHighlight : "transparent"}
                _hover={{ bg: hoverBg }}
                transition="background 0.12s"
                onClick={toggleAll}
                textAlign="left"
              >
                <Checkbox
                  isChecked={allSelected}
                  isIndeterminate={form.selectedEntities.length > 0 && !allSelected}
                  colorScheme="blue"
                  size="sm"
                  pointerEvents="none"
                />
                <Text fontSize="sm" fontWeight="semibold" color={labelColor}>
                  All
                </Text>
              </Flex>

              {/* Entity rows */}
              {filtered.map((entity) => {
                const isChecked = form.selectedEntities.includes(entity.id);
                return (
                  <Flex
                    as="button"
                    type="button"
                    key={entity.id}
                    w="full"
                    px={4}
                    py={2}
                    align="center"
                    gap={3}
                    cursor="pointer"
                    _hover={{ bg: hoverBg }}
                    transition="background 0.12s"
                    onClick={() => toggleEntity(entity.id)}
                    textAlign="left"
                  >
                    <Checkbox
                      isChecked={isChecked}
                      colorScheme="blue"
                      size="sm"
                      pointerEvents="none"
                    />
                    <Text fontSize="sm" color={labelColor} noOfLines={1}>
                      {entityLabel(entity)}
                    </Text>
                  </Flex>
                );
              })}

              {filtered.length === 0 && (
                <Text fontSize="xs" color={hintColor} px={4} py={3}>
                  No entities match your search.
                </Text>
              )}
            </Box>
          )}
        </Box>
      </FormControl>
      </SimpleGrid>

      {/* Filter modal */}
      <BeneEntityFilterModal
        isOpen={filterModal.isOpen}
        onClose={filterModal.onClose}
        selectedIds={form.selectedEntities}
        onChangeSelected={(ids) => onChange({ selectedEntities: ids })}
      />
    </Box>
  );
}
