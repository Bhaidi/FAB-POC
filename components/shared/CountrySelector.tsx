"use client";

import {
  FormControl,
  FormLabel,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { countries } from "@/data/countries";

interface CountrySelectorProps extends Omit<SelectProps, "children"> {
  label?: string;
}

export function CountrySelector({ label = "Country", ...selectProps }: CountrySelectorProps) {
  return (
    <FormControl>
      <FormLabel color="neutral.mainText" fontSize="sm">
        {label}
      </FormLabel>
      <Select
        placeholder="Select country"
        bg="white"
        borderColor="neutral.border"
        color="neutral.mainText"
        _focus={{ borderColor: "blue.500" }}
        {...selectProps}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.dialCode})
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
