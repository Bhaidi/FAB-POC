"use client";

import Link from "next/link";
import { Box, Heading, Text } from "@chakra-ui/react";

/**
 * Custom 404 so we never show Next’s default system-ui stack (Graphik-only app).
 */
export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={6}
      textAlign="center"
      fontFamily="var(--font-graphik)"
      bg="neutral.pageBg"
      color="neutral.mainText"
    >
      <Heading as="h1" size="lg" fontFamily="var(--font-graphik)" fontWeight={600} mb={2}>
        Page not found
      </Heading>
      <Text fontFamily="var(--font-graphik)" color="neutral.secondaryText" mb={8} maxW="md">
        The page you are looking for does not exist or has been moved.
      </Text>
      <Text
        as={Link}
        href="/login"
        fontFamily="var(--font-graphik)"
        color="accent.linkCta"
        fontWeight={500}
        _hover={{ textDecoration: "underline" }}
      >
        Go to sign in
      </Text>
    </Box>
  );
}
