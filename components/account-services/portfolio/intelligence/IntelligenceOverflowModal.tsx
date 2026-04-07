"use client";

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { AlertItem } from "@/components/account-services/portfolio/intelligence/AlertItem";
import { EventItem } from "@/components/account-services/portfolio/intelligence/EventItem";
import type { IntelligenceAlertItem, IntelligenceEventItem, ExecutiveIntelligencePanel } from "@/data/treasurySummaryTypes";

export type IntelligenceOverflowKind = "insight" | "events" | "alerts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  kind: IntelligenceOverflowKind | null;
  panel: ExecutiveIntelligencePanel;
  onEventSelect: (event: IntelligenceEventItem) => void;
  onAlertSelect: (alert: IntelligenceAlertItem) => void;
};

export function IntelligenceOverflowModal({
  isOpen,
  onClose,
  kind,
  panel,
  onEventSelect,
  onAlertSelect,
}: Props) {
  const title =
    kind === "insight" ? "Insight detail" : kind === "events" ? "More events" : kind === "alerts" ? "More alerts" : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="rgba(0, 2, 12, 0.72)" backdropFilter="blur(8px)" />
      <ModalContent
        mx={4}
        borderRadius="14px"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.1)"
        bg="rgba(22, 28, 52, 0.97)"
        boxShadow="0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
      >
        <ModalHeader
          fontFamily="var(--font-graphik)"
          fontSize="17px"
          fontWeight={500}
          color="white"
          borderBottomWidth="1px"
          borderColor="rgba(255,255,255,0.08)"
          pb={3}
        >
          {title}
        </ModalHeader>
        <ModalCloseButton color="rgba(255,255,255,0.55)" _hover={{ color: "white", bg: "rgba(255,255,255,0.08)" }} />
        <ModalBody py={5} px={6} pb={6}>
          {kind === "insight" ? (
            <Box>
              <Text fontFamily="var(--font-graphik)" fontSize="13px" fontWeight={600} color="rgba(255,255,255,0.88)" lineHeight={1.45} mb={4}>
                {panel.insight.headline}
              </Text>
              {panel.insight.drivers.length > 0 ? (
                <Box as="ul" listStyleType="none" m={0} p={0} mb={panel.insight.recommendation ? 4 : 0}>
                  {panel.insight.drivers.map((d, i) => (
                    <Text
                      key={i}
                      as="li"
                      fontFamily="var(--font-graphik)"
                      fontSize="12px"
                      lineHeight={1.5}
                      color="rgba(255,255,255,0.72)"
                      mb={2}
                      pl={3}
                      position="relative"
                      _before={{
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "0.55em",
                        w: "4px",
                        h: "4px",
                        borderRadius: "full",
                        bg: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {d}
                    </Text>
                  ))}
                </Box>
              ) : null}
              {panel.insight.recommendation ? (
                <Text fontFamily="var(--font-graphik)" fontSize="12px" lineHeight={1.5} color="rgba(255,255,255,0.52)">
                  <Text as="span" color="rgba(255,255,255,0.4)">
                    Recommendation ·{" "}
                  </Text>
                  {panel.insight.recommendation}
                </Text>
              ) : null}
            </Box>
          ) : null}

          {kind === "events" ? (
            <Box as="ul" m={0} p={0} listStyleType="none">
              {panel.events.slice(1).map((ev, i) => (
                <EventItem key={ev.id} event={ev} index={i} onSelect={onEventSelect} />
              ))}
            </Box>
          ) : null}

          {kind === "alerts" ? (
            <Box as="ul" m={0} p={0} listStyleType="none">
              {panel.alerts.slice(1).map((al, i) => (
                <AlertItem key={al.id} alert={al} index={i} onSelect={onAlertSelect} />
              ))}
            </Box>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
