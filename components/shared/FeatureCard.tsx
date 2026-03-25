"use client";

import {
  Card,
  CardBody,
  Heading,
  Text,
  Icon,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function FeatureCard({
  title,
  description,
  href = "#",
  icon,
}: FeatureCardProps) {
  const content = (
    <Card
      variant="elevated"
      bg="white"
      borderWidth="1px"
      borderColor="neutral.border"
      _hover={{ borderColor: "accent.linkCta", shadow: "md" }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody>
        {icon && (
          <Box mb={3}>
            <Icon as={icon} boxSize={8} color="accent.linkCta" />
          </Box>
        )}
        <Heading size="sm" color="neutral.mainText" mb={2}>
          {title}
        </Heading>
        <Text fontSize="sm" color="neutral.secondaryText" noOfLines={2}>
          {description}
        </Text>
      </CardBody>
    </Card>
  );

  if (href && href !== "#") {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
