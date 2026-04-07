export type AiDecisionPriority = "high" | "medium" | "low";

export type AiDecision = {
  id: string;
  priority: AiDecisionPriority;
  title: string;
  context: string;
  impact: string;
  confidence: number;
  primaryAction: string;
  secondaryAction?: string;
  /** Optional expandable “AI reasoning” copy */
  reasoning?: string;
};
