"use client";

import {
  Box,
  Flex,
  Icon,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { GlassCredentialFieldFrame } from "@/components/auth/GlassCredentialFieldFrame";
import { AUTH_INPUT_FIGMA_LAYOUT, getAuthInputFieldStyles } from "@/components/auth/authInputStyles";
import { DsTextField } from "@/components/ui/DsTextField";
import { getDsGlassTextFieldInnerStyles } from "@/lib/fabTheme/dsTextField";

interface LoginInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ElementType;
}

/**
 * Credential field — same DS glass treatment as the main login form ({@link DsTextField}).
 */
export function LoginInput({
  id,
  label,
  placeholder,
  type = "text",
  leftIcon,
}: LoginInputProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  if (!leftIcon) {
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
        <DsTextField authLayout authLoginChrome id={id} type={type} placeholder={placeholder} />
      </Box>
    );
  }

  if (isDark) {
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
        <GlassCredentialFieldFrame chrome="authLogin" height="48px" w="100%" maxW="100%">
          <Flex align="center" w="full" minW={0} pl="12px" pr="24px" gap={3}>
            <Icon as={leftIcon} color="whiteAlpha.500" boxSize={5} flexShrink={0} pointerEvents="none" />
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              variant="unstyled"
              {...getDsGlassTextFieldInnerStyles({ paddingX: false })}
            />
          </Flex>
        </GlassCredentialFieldFrame>
      </Box>
    );
  }

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
      <Flex align="center" {...AUTH_INPUT_FIGMA_LAYOUT} position="relative">
        <Box position="absolute" left={3} pointerEvents="none" zIndex={1} display="flex" alignItems="center">
          <Icon as={leftIcon} color="gray.500" boxSize={5} />
        </Box>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          variant="unstyled"
          {...getAuthInputFieldStyles(colorMode)}
          pl={12}
          pr="24px"
        />
      </Flex>
    </Box>
  );
}
