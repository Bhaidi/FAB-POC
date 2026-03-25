"use client";

import { Text } from "@chakra-ui/react";

export function InlineFieldError({ id, message }: { id?: string; message: string }) {
  return (
    <Text
      id={id}
      role="alert"
      fontFamily="var(--font-graphik)"
      fontSize="13px"
      lineHeight="1.45"
      color="rgba(255, 160, 160, 0.95)"
      mt={2}
    >
      {message}
    </Text>
  );
}
