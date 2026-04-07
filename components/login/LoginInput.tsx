"use client";

import { useMemo } from "react";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { AUTH_INPUT_FIGMA_LAYOUT, getAuthInputFieldStyles } from "@/components/auth/authInputStyles";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

interface LoginInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ElementType;
}

/**
 * Dark credential field — Design System text field (Figma 558:17083).
 */
export function LoginInput({
  id,
  label,
  placeholder,
  type = "text",
  leftIcon,
}: LoginInputProps) {
  const { colorMode } = useColorMode();
  const field = useMemo(() => {
    if (leftIcon) {
      return {
        ...getDsTextFieldStyles({
          colorMode: colorMode === "dark" ? "dark" : "light",
          height: "48px",
          paddingX: false,
        }),
        ...AUTH_INPUT_FIGMA_LAYOUT,
      } as const;
    }
    return getAuthInputFieldStyles(colorMode);
  }, [leftIcon, colorMode]);

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
        {leftIcon ? (
          <InputLeftElement pointerEvents="none" h="48px" w="48px">
            <Icon as={leftIcon} color="whiteAlpha.500" boxSize={5} />
          </InputLeftElement>
        ) : null}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          variant="unstyled"
          {...field}
          pl={leftIcon ? 12 : undefined}
          pr={leftIcon ? "24px" : undefined}
        />
      </InputGroup>
    </Box>
  );
}
