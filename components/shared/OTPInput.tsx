"use client";

import { HStack, PinInput, PinInputField } from "@chakra-ui/react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
}: OTPInputProps) {
  return (
    <HStack spacing={2} justify="center">
      <PinInput
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        otp
        manageFocus
        size="lg"
      >
        {Array.from({ length }).map((_, i) => (
          <PinInputField
            key={i}
            bg="neutral.offWhiteAlt"
            borderColor="neutral.border"
            _focus={{ borderColor: "accent.linkCta", boxShadow: "0 0 0 1px var(--chakra-colors-accent-linkCta)" }}
            color="neutral.mainText"
          />
        ))}
      </PinInput>
    </HStack>
  );
}
