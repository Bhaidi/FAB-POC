"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { IconChevronDown, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { currencyFlagMap } from "@/data/iftPaymentMock";

export interface AccountItem {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  balance?: number;
  /** Secondary line — e.g. entity name */
  subtitle?: string;
  /** Country code abbreviation (e.g. FR, AE) */
  countryCode?: string;
  /** Bank name for beneficiary rows */
  bankName?: string;
  /** BIC / SWIFT code for beneficiary rows */
  bic?: string;
  isFavorite?: boolean;
  isRecent?: boolean;
}

interface IftAccountDropdownProps {
  items: AccountItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder: string;
}

export function IftAccountDropdown({
  items,
  selectedId,
  onSelect,
  placeholder,
}: IftAccountDropdownProps) {
  const { dashColors } = useFabTokens();
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const panelBg = useColorModeValue("white", dashColors.surfaceBase);
  const hoverBg = useColorModeValue("blue.50", dashColors.surfaceHover);
  const selectedRowBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.12)");
  const selectedBorderColor = useColorModeValue("accent.linkCta", "#60A5FA");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick({
    ref,
    handler: () => {
      setOpen(false);
      setSearch("");
      setInputFocused(false);
    },
  });

  const selected = items.find((i) => i.id === selectedId);

  /* Display text for the trigger input */
  const displayText = selected
    ? `${selected.accountNumber} (${selected.accountName})`
    : "";

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.accountName.toLowerCase().includes(q) ||
        i.accountNumber.toLowerCase().includes(q) ||
        (i.subtitle?.toLowerCase().includes(q) ?? false) ||
        (i.countryCode?.toLowerCase().includes(q) ?? false) ||
        (i.bankName?.toLowerCase().includes(q) ?? false) ||
        (i.bic?.toLowerCase().includes(q) ?? false),
    );
  }, [items, search]);

  const recents = filtered.filter((i) => i.isRecent).slice(0, 3);
  const all = [...filtered].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <Box position="relative" ref={ref} flex={1}>
      {/* Searchable trigger input */}
      <InputGroup size="md">
        <Input
          ref={inputRef}
          h="40px"
          bg={fieldBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="4px"
          px={3}
          pr={8}
          fontSize="sm"
          color={labelColor}
          placeholder={placeholder}
          _placeholder={{ color: hintColor }}
          _hover={{ borderColor: "accent.linkCta" }}
          value={inputFocused ? search : displayText}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setInputFocused(true);
            setSearch("");
            setOpen(true);
          }}
          onBlur={() => {
            /* blur is handled by outside click */
          }}
          autoComplete="off"
        />
        <InputRightElement h="40px" pointerEvents="all" cursor="pointer" onClick={() => {
          setOpen((p) => !p);
          if (!open) {
            setInputFocused(true);
            setSearch("");
            inputRef.current?.focus();
          }
        }}>
          <IconChevronDown size={16} color="gray" />
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
          maxH="340px"
          overflowY="auto"
        >

          {/* Recents */}
          {recents.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color={labelColor} px={4} py={2}>
                Recents
              </Text>
              {recents.map((item) => (
                <AccountRow
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  hoverBg={hoverBg}
                  selectedBg={selectedRowBg}
                  selectedBorderColor={selectedBorderColor}
                  labelColor={labelColor}
                  hintColor={hintColor}
                  onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                    setSearch("");
                    setInputFocused(false);
                    inputRef.current?.blur();
                  }}
                />
              ))}
            </Box>
          )}

          {/* All */}
          <Box>
            <Text fontSize="xs" fontWeight="semibold" color={labelColor} px={4} py={2}>
              All
            </Text>
            {all.map((item) => (
              <AccountRow
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                hoverBg={hoverBg}
                selectedBg={selectedRowBg}
                selectedBorderColor={selectedBorderColor}
                labelColor={labelColor}
                hintColor={hintColor}
                onClick={() => {
                  onSelect(item.id);
                  setOpen(false);
                  setSearch("");
                  setInputFocused(false);
                  inputRef.current?.blur();
                }}
              />
            ))}
            {all.length === 0 && (
              <Text fontSize="xs" color={hintColor} px={4} py={3}>
                No accounts found
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ── Single account row ───────────────────────── */

function AccountRow({
  item,
  isSelected,
  hoverBg,
  selectedBg,
  selectedBorderColor,
  labelColor,
  hintColor,
  onClick,
}: {
  item: AccountItem;
  isSelected: boolean;
  hoverBg: string;
  selectedBg: string;
  selectedBorderColor: string;
  labelColor: string;
  hintColor: string;
  onClick: () => void;
}) {
  const flag = currencyFlagMap[item.currency] ?? "";
  return (
    <Flex
      as="button"
      type="button"
      w="full"
      px={4}
      py={2.5}
      align="flex-start"
      gap={2.5}
      cursor="pointer"
      bg={isSelected ? selectedBg : "transparent"}
      borderLeftWidth="3px"
      borderLeftColor={isSelected ? selectedBorderColor : "transparent"}
      _hover={{ bg: hoverBg }}
      transition="background 0.12s"
      onClick={onClick}
      textAlign="left"
    >
      {/* Favorite star */}
      <Box pt="2px" flexShrink={0} w="16px">
        {item.isFavorite && (
          <IconStarFilled size={14} color="#F59E0B" />
        )}
      </Box>

      {/* Main content */}
      <Box flex={1} minW={0}>
        {/* Row 1: Name · Account number + currency badge */}
        <Flex align="center" justify="space-between" gap={2}>
          <Text fontSize="sm" fontWeight="medium" color={labelColor} noOfLines={1}>
            {item.accountName} <Text as="span" fontWeight="normal" color={hintColor}>· {item.accountNumber}</Text>
          </Text>
          {item.currency && (
            <Flex
              align="center"
              gap={1}
              bg={isSelected ? "rgba(0, 98, 255, 0.08)" : "transparent"}
              borderWidth="1px"
              borderColor={isSelected ? "accent.linkCta" : "transparent"}
              borderRadius="full"
              px={2}
              py={0.5}
              flexShrink={0}
            >
              {flag && <Text fontSize="xs" lineHeight={1}>{flag}</Text>}
              <Text fontSize="2xs" fontWeight="semibold" color={labelColor}>
                {item.currency}
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Row 2: Country code · bank · BIC or subtitle */}
        <Text fontSize="xs" color={hintColor} noOfLines={1} mt={0.5}>
          {item.countryCode ?? ""}
          {item.bankName ? ` · ${item.bankName}` : ""}
          {item.bic ? ` · ${item.bic}` : ""}
          {!item.countryCode && !item.bankName && item.subtitle ? item.subtitle : ""}
          {item.countryCode && !item.bankName && item.subtitle ? ` · ${item.subtitle}` : ""}
        </Text>
      </Box>
    </Flex>
  );
}
