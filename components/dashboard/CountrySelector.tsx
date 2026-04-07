"use client";

import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi2";
import { countries } from "@/data/countries";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

type CountrySelectorProps = {
  valueCode: string;
  onChange?: (code: string) => void;
};

/** Compact dark-theme country control for the dashboard top bar. */
export function CountrySelector({ valueCode, onChange }: CountrySelectorProps) {
  const { dashColors } = useFabTokens();
  const selected = countries.find((c) => c.code === valueCode) ?? countries[0];

  return (
    <Menu placement="bottom-end" strategy="fixed">
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        fontFamily="var(--font-graphik)"
        fontWeight={400}
        fontSize="13px"
        color={dashColors.text.secondary}
        borderRadius={dashRadius.surface}
        border="1px solid"
        borderColor="rgba(255,255,255,0.1)"
        bg="rgba(255,255,255,0.04)"
        px={3}
        h="36px"
        _hover={{ bg: "rgba(255,255,255,0.08)", color: dashColors.text.primary }}
        _active={{ bg: "rgba(255,255,255,0.1)" }}
      >
        <Flex align="center" gap={1}>
          <Text as="span" noOfLines={1} maxW="140px">
            {selected.name}
          </Text>
          <HiChevronDown size={16} opacity={0.85} />
        </Flex>
      </MenuButton>
      <MenuList
        bg="rgba(12, 16, 32, 0.96)"
        borderColor="rgba(255,255,255,0.12)"
        backdropFilter="blur(12px)"
        py={1}
        maxH="280px"
        overflowY="auto"
        zIndex={200}
      >
        {countries.slice(0, 40).map((c) => (
          <MenuItem
            key={c.code}
            fontFamily="var(--font-graphik)"
            fontSize="sm"
            bg={c.code === valueCode ? "rgba(0,98,255,0.15)" : "transparent"}
            color={dashColors.text.primary}
            _hover={{ bg: "rgba(255,255,255,0.08)" }}
            _focus={{ bg: "rgba(255,255,255,0.08)" }}
            onClick={() => onChange?.(c.code)}
          >
            {c.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
