"use client";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";

interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  id,
  ...inputProps
}: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel htmlFor={id} color="neutral.mainText" fontSize="sm">
          {label}
        </FormLabel>
      )}
      <Input
        id={id}
        variant="filled"
        bg="neutral.offWhiteAlt"
        borderColor="neutral.border"
        _focus={{ borderColor: "accent.linkCta", boxShadow: "0 0 0 1px var(--chakra-colors-accent-linkCta)" }}
        color="neutral.mainText"
        placeholder={inputProps.placeholder}
        {...inputProps}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
