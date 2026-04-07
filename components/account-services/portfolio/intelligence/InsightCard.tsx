"use client";

import { ExpandableInsight } from "@/components/account-services/portfolio/intelligence/ExpandableInsight";
import { INTELLIGENCE_CONTENT_INDENT } from "@/components/account-services/portfolio/intelligence/intelligenceLayout";
import { IntelligenceSectionHeader } from "@/components/account-services/portfolio/intelligence/IntelligenceSectionHeader";
import type { IntelligenceInsightContent } from "@/data/treasurySummaryTypes";

type InsightCardProps = {
  insight: IntelligenceInsightContent;
  showIntro?: boolean;
};

export function InsightCard({ insight, showIntro }: InsightCardProps) {
  return (
    <div className="min-w-0">
      <IntelligenceSectionHeader variant="insight" label="Insight" />
      <div className={INTELLIGENCE_CONTENT_INDENT}>
        <ExpandableInsight insight={insight} showIntro={showIntro} />
      </div>
    </div>
  );
}
