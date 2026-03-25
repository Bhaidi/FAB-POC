"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

interface HeroPanelProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function HeroPanel({ title, subtitle, children }: HeroPanelProps) {
  return (
    <Box
      bg="brand.heroGradient"
      borderRadius="xl"
      p={8}
      borderWidth="1px"
      borderColor="whiteAlpha.300"
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="lg" color="white">
          {title}
        </Heading>
        {subtitle && (
          <Text color="whiteAlpha.900" fontSize="sm">
            {subtitle}
          </Text>
        )}
        {children}
      </VStack>
    </Box>
  );
}
