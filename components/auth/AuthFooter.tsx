"use client";

import NextLink from "next/link";
import { Box, Flex, Text } from "@chakra-ui/react";
import { authMotion } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Security", href: "#security" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "FAQs", href: "#faqs" },
] as const;

/**
 * Legal links row — fixed auth bottom stack.
 */
export function AuthFooter() {
  const { authColors } = useFabTokens();
  return (
    <Box
      as="nav"
      aria-label="Legal and support links"
      w="full"
      flexShrink={0}
      px={{ base: 4, md: 6 }}
      pt={3}
      pb="calc(0.85rem + env(safe-area-inset-bottom, 0px))"
      pointerEvents="none"
      bg="transparent"
    >
      <Flex
        pointerEvents="auto"
        flexWrap="wrap"
        align="center"
        justify="center"
        columnGap={{ base: "1rem", sm: "1.35rem", md: "1.75rem", lg: "2.25rem" }}
        rowGap={{ base: 2, md: 2.5 }}
        maxW="100%"
        mx="auto"
      >
        {LEGAL_LINKS.map((item, i) => (
          <Flex key={item.href} align="center" gap={3} as="span" flexWrap="wrap" justify="center">
            {i > 0 ? (
              <Text
                as="span"
                fontSize="11px"
                color={authColors.text.faint}
                userSelect="none"
                aria-hidden
                lineHeight="1"
                px={0.5}
              >
                ·
              </Text>
            ) : null}
            <Text
              as={NextLink}
              href={item.href}
              fontFamily="var(--font-graphik)"
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight={500}
              color={authColors.text.tertiary}
              lineHeight="1.45"
              whiteSpace="nowrap"
              _hover={{
                color: authColors.text.primary,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
              _focusVisible={{
                outline: "2px solid rgba(0, 98, 255, 0.55)",
                outlineOffset: "3px",
                borderRadius: "4px",
              }}
              transition={`color ${authMotion.duration.normal}s cubic-bezier(${authMotion.easing.out.join(",")}), text-decoration-offset ${authMotion.duration.normal}s ease`}
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
