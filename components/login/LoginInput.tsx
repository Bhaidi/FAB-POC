"use client";

import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";

interface LoginInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ElementType;
}

/**
 * Dark sleek input for login/fintech screens. Glass-style with blue focus glow.
 */
export function LoginInput({
  id,
  label,
  placeholder,
  type = "text",
  leftIcon,
}: LoginInputProps) {
  return (
    <Box>
      <Text
        as="label"
        htmlFor={id}
        fontSize="xs"
        color="whiteAlpha.800"
        mb={2}
        display="block"
        fontWeight={500}
      >
        {label}
      </Text>
      <InputGroup>
        {leftIcon && (
          <InputLeftElement pointerEvents="none" h="44px">
            <Icon as={leftIcon} color="whiteAlpha.500" boxSize={5} />
          </InputLeftElement>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          pl={leftIcon ? 10 : 4}
          h="44px"
          minH="44px"
          borderRadius="md"
          bg="loginScreen.inputBg"
          border="1px solid"
          borderColor="loginScreen.inputBorder"
          color="white"
          fontSize="sm"
          _placeholder={{ color: "whiteAlpha.4" }}
          _hover={{ borderColor: "whiteAlpha.2" }}
          _focus={{
            borderColor: "accent.linkCta",
            boxShadow: "0 0 0 1px var(--chakra-colors-accent-linkCta), 0 0 20px rgba(15, 98, 254, 0.15)",
            outline: "none",
          }}
        />
      </InputGroup>
    </Box>
  );
}
