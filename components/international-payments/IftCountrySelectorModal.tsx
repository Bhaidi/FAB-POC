"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
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
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftCountry } from "@/data/iftPaymentTypes";

interface IftCountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: IftCountry[];
  selectedCode: string;
  onSelect: (code: string) => void;
}

export function IftCountrySelectorModal({
  isOpen,
  onClose,
  countries,
  selectedCode,
  onSelect,
}: IftCountrySelectorModalProps) {
  const { dashColors } = useFabTokens();
  const modalBg = useColorModeValue("white", dashColors.surfaceBase);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const hintColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const fieldBg = useColorModeValue("white", dashColors.surfaceElevated);
  const cardBg = useColorModeValue("white", dashColors.cardBg);
  const selectedBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.12)");
  const selectedBorder = useColorModeValue("accent.linkCta", "#60A5FA");
  const regionColor = useColorModeValue("accent.linkCta", "#60A5FA");

  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(selectedCode);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q),
    );
  }, [countries, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, IftCountry[]>();
    for (const c of filtered) {
      const list = map.get(c.region) ?? [];
      list.push(c);
      map.set(c.region, list);
    }
    return map;
  }, [filtered]);

  const handleConfirm = () => {
    onSelect(pending);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={modalBg} borderRadius="20px" mx={4}>
        <ModalHeader pb={1}>
          <Text fontSize="lg" fontWeight="semibold" color={labelColor}>
            Select Operating Country
          </Text>
          <Text fontSize="xs" color={hintColor} mt={1} fontWeight="normal">
            Choose the country where this payment is being initiated from. Regulatory fields,
            currency and compliance rules will adapt accordingly.
          </Text>
        </ModalHeader>
        <ModalCloseButton color={labelColor} />

        <ModalBody pt={2} pb={4}>
          {/* Search */}
          <InputGroup mb={5}>
            <InputLeftElement pointerEvents="none" h="44px">
              <IconSearch size={18} color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg={fieldBg}
              borderColor={borderColor}
              color={labelColor}
              fontSize="sm"
              h="44px"
              borderRadius="lg"
              _placeholder={{ color: hintColor }}
            />
          </InputGroup>

          {/* Grouped countries */}
          <Flex direction="column" gap={5}>
            {Array.from(grouped.entries()).map(([region, list]: [string, IftCountry[]]) => (
              <Box key={region}>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={regionColor}
                  mb={2}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                  pb={1}
                >
                  {region}
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                  {list.map((c) => {
                    const isSelected = c.code === pending;
                    return (
                      <Box
                        key={c.code}
                        as="button"
                        borderWidth="1px"
                        borderColor={isSelected ? selectedBorder : borderColor}
                        bg={isSelected ? selectedBg : cardBg}
                        borderRadius="lg"
                        px={3}
                        py={3}
                        cursor="pointer"
                        textAlign="left"
                        transition="all 0.15s"
                        _hover={{ borderColor: selectedBorder }}
                        onClick={() => setPending(c.code)}
                      >
                        <Flex align="center" gap={2}>
                          <Text fontSize="xl" lineHeight={1}>
                            {c.flagEmoji}
                          </Text>
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                              {c.name}
                            </Text>
                            <Text fontSize="xs" color={hintColor}>
                              {c.currency}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Box>
            ))}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="accent.linkCta"
            color="white"
            borderRadius="lg"
            fontWeight="medium"
            fontSize="sm"
            px={8}
            _hover={{ bg: "blue.600" }}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
