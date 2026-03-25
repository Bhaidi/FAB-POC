"use client";

import { Card, CardHeader, CardBody, Heading, Table, Tbody, Tr, Td, Text } from "@chakra-ui/react";
import { exchangeRates } from "@/data/exchange-rates";

export function CurrencyRatesCard() {
  return (
    <Card bg="white" borderWidth="1px" borderColor="neutral.border">
      <CardHeader>
        <Heading size="sm" color="neutral.mainText">
          Exchange Rates (vs AED)
        </Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Table size="sm" variant="simple">
          <Tbody>
            {exchangeRates.map((r) => (
              <Tr key={r.code}>
                <Td color="neutral.mainText">{r.code}</Td>
                <Td color="neutral.secondaryText">{r.currency}</Td>
                <Td isNumeric color="neutral.mainText">
                  {r.rate.toFixed(4)}
                </Td>
                <Td isNumeric>
                  <Text
                    as="span"
                    color={r.change != null && r.change >= 0 ? "semantic.success" : "red.500"}
                    fontSize="xs"
                  >
                    {r.change != null ? `${r.change >= 0 ? "+" : ""}${r.change}%` : "—"}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* TODO: Replace with live API rates */}
      </CardBody>
    </Card>
  );
}
