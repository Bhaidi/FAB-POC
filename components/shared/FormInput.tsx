"use client";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputProps,
} from "@chakra-ui/react";
import { DsTextField } from "@/components/ui/DsTextField";

interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, id, ...inputProps }: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel htmlFor={id} color="neutral.mainText" fontSize="sm">
          {label}
        </FormLabel>
      )}
      <DsTextField id={id} w="full" placeholder={inputProps.placeholder} {...inputProps} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
