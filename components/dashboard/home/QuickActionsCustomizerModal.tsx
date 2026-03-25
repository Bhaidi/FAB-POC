"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { QuickActionCatalogEntry } from "@/data/quickActionsCatalog";
import type { QuickActionId } from "@/data/quickActionsCatalog";
import { QuickActionOption } from "@/components/dashboard/home/QuickActionOption";

export function QuickActionsCustomizerModal({
  isOpen,
  onClose,
  entries,
  initialSelectedIds,
  onSave,
  onResetToDefaults,
}: {
  isOpen: boolean;
  onClose: () => void;
  entries: QuickActionCatalogEntry[];
  initialSelectedIds: QuickActionId[];
  onSave: (ids: QuickActionId[]) => Promise<void>;
  onResetToDefaults: () => Promise<void>;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<QuickActionId[]>([]);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (isOpen) setDraft(initialSelectedIds.slice(0, 4));
  }, [isOpen, initialSelectedIds]);

  const toggle = (id: QuickActionId) => {
    setDraft((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        toast({
          title: "Choose up to 4",
          description: "Deselect an action before adding another.",
          status: "info",
          duration: 2600,
          isClosable: true,
          position: "top",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    if (draft.length === 0) {
      toast({
        title: "Select at least one",
        description: "Pick at least one quick action, or cancel.",
        status: "warning",
        duration: 2800,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setWorking(true);
    try {
      await onSave(draft);
      toast({
        title: "Quick actions updated",
        status: "success",
        duration: 2400,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch {
      toast({
        title: "Could not save",
        description: "Try again in a moment.",
        status: "error",
        duration: 3200,
        isClosable: true,
        position: "top",
      });
    } finally {
      setWorking(false);
    }
  };

  const handleReset = async () => {
    setWorking(true);
    try {
      await onResetToDefaults();
      toast({
        title: "Quick actions updated",
        description: "Restored default shortcuts for your role.",
        status: "success",
        duration: 2600,
        isClosable: true,
        position: "top",
      });
      onClose();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="rgba(0, 2, 12, 0.72)" backdropFilter="blur(8px)" />
      <ModalContent
        mx={4}
        borderRadius="16px"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.12)"
        bg="rgba(10, 14, 32, 0.97)"
        boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)"
      >
        <ModalHeader
          fontFamily="var(--font-graphik)"
          fontSize="lg"
          fontWeight={600}
          letterSpacing="-0.02em"
          color="white"
          pb={2}
        >
          Customize Quick Actions
        </ModalHeader>
        <ModalCloseButton color="rgba(255,255,255,0.55)" _hover={{ color: "white", bg: "rgba(255,255,255,0.08)" }} />
        <ModalBody pb={2}>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="13px"
            color="rgba(255,255,255,0.58)"
            mb={4}
            lineHeight={1.45}
          >
            Choose up to 4 actions for your dashboard
          </Text>
          <VStack align="stretch" spacing={2.5} maxH={{ base: "52vh", md: "420px" }} overflowY="auto">
            {entries.map((entry) => {
              const sel = draft.includes(entry.id);
              return (
                <QuickActionOption
                  key={entry.id}
                  entry={entry}
                  selected={sel}
                  onToggle={() => toggle(entry.id)}
                />
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter gap={2} flexWrap="wrap">
          <Button
            variant="ghost"
            size="sm"
            fontFamily="var(--font-graphik)"
            color="rgba(255,255,255,0.55)"
            _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
            onClick={handleReset}
            isDisabled={working}
          >
            Reset to default
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fontFamily="var(--font-graphik)"
            color="rgba(255,255,255,0.55)"
            _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
            onClick={onClose}
            isDisabled={working}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            fontFamily="var(--font-graphik)"
            bg="rgba(0, 98, 255, 0.88)"
            color="white"
            _hover={{ bg: "rgba(0, 98, 255, 1)" }}
            onClick={handleSave}
            isLoading={working}
            isDisabled={working || draft.length === 0}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
