"use client";

import { Card, CardBody, VStack, Text, Heading, Button } from "@chakra-ui/react";

interface EmptyStateCardProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateCard({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <Card bg="white" borderWidth="1px" borderColor="neutral.border">
      <CardBody>
        <VStack spacing={3} py={6}>
          <Heading size="sm" color="neutral.secondaryText">
            {title}
          </Heading>
          {description && (
            <Text fontSize="sm" color="neutral.mutedTextAlt" textAlign="center">
              {description}
            </Text>
          )}
          {actionLabel && onAction && (
            <Button size="sm" colorScheme="blue" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
