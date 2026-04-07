"use client";

import { Button, useDisclosure } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AlertItem } from "@/components/account-services/portfolio/intelligence/AlertItem";
import { EventItem } from "@/components/account-services/portfolio/intelligence/EventItem";
import {
  IntelligenceOverflowModal,
  type IntelligenceOverflowKind,
} from "@/components/account-services/portfolio/intelligence/IntelligenceOverflowModal";
import { INTELLIGENCE_CONTENT_INDENT } from "@/components/account-services/portfolio/intelligence/intelligenceLayout";
import { IntelligenceList } from "@/components/account-services/portfolio/intelligence/IntelligenceList";
import { IntelligenceSectionHeader } from "@/components/account-services/portfolio/intelligence/IntelligenceSectionHeader";
import type { ExecutiveIntelligencePanel } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const EASE = [0.33, 1, 0.68, 1] as const;

type IntelligenceSectionProps = {
  /** Drives panel data + AnimatePresence key (portfolio | accounts | deposits | loans). */
  currentView: PortfolioModuleTab;
  panel: ExecutiveIntelligencePanel;
};

function insightHasMoreContent(insight: ExecutiveIntelligencePanel["insight"]): boolean {
  return insight.drivers.length > 0 || Boolean(insight.recommendation);
}

export function IntelligenceSection({ currentView, panel }: IntelligenceSectionProps) {
  const reduceMotion = useReducedMotion() === true;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overflowKind, setOverflowKind] = useState<IntelligenceOverflowKind | null>(null);

  const firstEvent = panel.events[0];
  const extraEventCount = Math.max(0, panel.events.length - 1);
  const firstAlert = panel.alerts[0];
  const extraAlertCount = Math.max(0, panel.alerts.length - 1);
  const showInsightMore = insightHasMoreContent(panel.insight);

  const onEventFilter = (event: (typeof panel.events)[number]) => {
    console.log("[intelligence] event filter (stub)", { module: currentView, eventId: event.id, label: event.label });
  };

  const onAlertFilter = (alert: (typeof panel.alerts)[number]) => {
    console.log("[intelligence] alert filter (stub)", {
      module: currentView,
      alertId: alert.id,
      severity: alert.severity,
      label: alert.label,
    });
  };

  const openOverflow = (kind: IntelligenceOverflowKind) => {
    setOverflowKind(kind);
    onOpen();
  };

  const closeOverflow = () => {
    onClose();
    setOverflowKind(null);
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentView}
          className="min-w-0"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
        >
          {/* One insight: headline only; drivers / recommendation in modal */}
          <div className="min-w-0">
            <IntelligenceSectionHeader variant="insight" label="Insight" />
            <div className={INTELLIGENCE_CONTENT_INDENT}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
              >
                <p className="max-w-[520px] pl-3 font-[family-name:var(--font-graphik)] text-[10px] font-semibold leading-[1.45] tracking-[-0.01em] text-[rgba(255,255,255,0.82)] sm:text-[11px]">
                  {panel.insight.headline}
                </p>
                {showInsightMore ? (
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    mt={1.5}
                    ml={3}
                    px={0}
                    h="auto"
                    minH={0}
                    py={0}
                    fontFamily="var(--font-graphik)"
                    fontSize="11px"
                    fontWeight={500}
                    color="rgba(99, 179, 237, 0.92)"
                    _hover={{ color: "rgba(147, 204, 255, 1)", textDecoration: "underline" }}
                    onClick={() => openOverflow("insight")}
                  >
                    More
                  </Button>
                ) : null}
              </motion.div>
            </div>
          </div>

          {firstEvent ? (
            <IntelligenceList variant="events" title="Events" delay={0.05}>
              <EventItem event={firstEvent} index={0} onSelect={onEventFilter} />
              {extraEventCount > 0 ? (
                <li className="list-none">
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    mt={0.5}
                    px={0}
                    h="auto"
                    minH={0}
                    py={1}
                    fontFamily="var(--font-graphik)"
                    fontSize="11px"
                    fontWeight={500}
                    color="rgba(99, 179, 237, 0.92)"
                    _hover={{ color: "rgba(147, 204, 255, 1)", textDecoration: "underline" }}
                    onClick={() => openOverflow("events")}
                  >
                    +{extraEventCount} more
                  </Button>
                </li>
              ) : null}
            </IntelligenceList>
          ) : null}

          {firstAlert ? (
            <IntelligenceList variant="alerts" title="Alerts" delay={0.1}>
              <AlertItem alert={firstAlert} index={0} onSelect={onAlertFilter} />
              {extraAlertCount > 0 ? (
                <li className="list-none">
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    mt={0.5}
                    px={0}
                    h="auto"
                    minH={0}
                    py={1}
                    fontFamily="var(--font-graphik)"
                    fontSize="11px"
                    fontWeight={500}
                    color="rgba(99, 179, 237, 0.92)"
                    _hover={{ color: "rgba(147, 204, 255, 1)", textDecoration: "underline" }}
                    onClick={() => openOverflow("alerts")}
                  >
                    +{extraAlertCount} more
                  </Button>
                </li>
              ) : null}
            </IntelligenceList>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <IntelligenceOverflowModal
        isOpen={isOpen}
        onClose={closeOverflow}
        kind={overflowKind}
        panel={panel}
        onEventSelect={onEventFilter}
        onAlertSelect={onAlertFilter}
      />
    </>
  );
}
