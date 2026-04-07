"use client";

import { useMemo } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
  useColorMode,
} from "@chakra-ui/react";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, id, ...inputProps }: FormInputProps) {
  const { colorMode } = useColorMode();
  const ds = useMemo(
    () =>
      getDsTextFieldStyles({
        colorMode: colorMode === "dark" ? "dark" : "light",
        height: "48px",
      }),
    [colorMode],
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel htmlFor={id} color="neutral.mainText" fontSize="sm">
          {label}
        </FormLabel>
      )}
      <Input id={id} variant="unstyled" {...ds} placeholder={inputProps.placeholder} {...inputProps} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
