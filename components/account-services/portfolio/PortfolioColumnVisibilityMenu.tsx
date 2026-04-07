"use client";

import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Switch,
  VStack,
} from "@chakra-ui/react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import type { CorporateGridColMeta } from "@/components/account-services/portfolio/corporateGrid/corporateGridColumnMeta";

type Props = {
  table: TanstackTable<CorporateBankingGridRow>;
};

export function PortfolioColumnVisibilityTrigger({ table }: Props) {
  const { corpTable } = useFabTokens();
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          aria-label="Table columns and preferences"
          icon={<SlidersHorizontal size={18} />}
          variant="ghost"
          size="sm"
          color="rgba(255,255,255,0.75)"
          _hover={{ bg: "rgba(255,255,255,0.08)", color: "white" }}
        />
      </PopoverTrigger>
      <PopoverContent
        bg="rgba(14, 18, 36, 0.98)"
        borderWidth={0}
        w="280px"
        zIndex={160}
        boxShadow="0 16px 48px rgba(0,0,0,0.35)"
      >
        <PopoverArrow bg="rgba(14, 18, 36, 0.98)" />
        <PopoverCloseButton color="rgba(255,255,255,0.5)" />
        <PopoverHeader
          borderBottomWidth={0}
          fontFamily={corpTable.chromeFontFamily}
          fontSize={corpTable.chromeFontSize}
          fontWeight={corpTable.chromeFontWeight}
          letterSpacing={corpTable.chromeLetterSpacing}
          color={corpTable.chromeText}
        >
          Column visibility
        </PopoverHeader>
        <PopoverBody>
          <VStack align="stretch" spacing={3}>
            {table.getAllLeafColumns().map((col) => {
              if (!col.getCanHide()) return null;
              const id = col.id;
              const label = (col.columnDef.meta as CorporateGridColMeta | undefined)?.label ?? id;
              return (
                <FormControl key={id} display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor={`col-vis-${id}`} mb={0} fontSize="sm" color="rgba(255,255,255,0.85)" fontFamily="var(--font-graphik)">
                    {label}
                  </FormLabel>
                  <Switch
                    id={`col-vis-${id}`}
                    size="sm"
                    colorScheme="blue"
                    isChecked={col.getIsVisible()}
                    onChange={(e) => col.toggleVisibility(e.target.checked)}
                  />
                </FormControl>
              );
            })}
            <Button
              size="xs"
              variant="ghost"
              fontFamily={corpTable.chromeFontFamily}
              fontWeight={corpTable.chromeFontWeight}
              fontSize={corpTable.chromeFontSizeSm}
              color={corpTable.chromeTextMuted}
              onClick={() => {
                table.getAllLeafColumns().forEach((col) => {
                  if (col.getCanHide() && !col.getIsVisible()) col.toggleVisibility(true);
                });
              }}
            >
              Show all
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
