"use client";

import { Box, Flex, Text, Avatar, HStack } from "@chakra-ui/react";
import { mockUserProfile } from "@/data/user-profile";

export function TopBar() {
  // TODO: Replace with real user from auth context/API
  const user = mockUserProfile;

  return (
    <Box
      as="header"
      h="14"
      px={4}
      borderBottomWidth="1px"
      borderColor="neutral.border"
      bg="brand.header"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontSize="sm" color="whiteAlpha.900">
        FAB Access
      </Text>
      <HStack spacing={3}>
        <Text fontSize="sm" color="whiteAlpha.800" noOfLines={1} maxW="120px">
          {user.name}
        </Text>
        <Avatar size="sm" name={user.name} bg="blue.500" />
      </HStack>
    </Box>
  );
}
