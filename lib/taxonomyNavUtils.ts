import type { TaxonomyMergeResult } from "@/lib/mergeServiceTaxonomy";
import { findActiveBranchIds } from "@/lib/sidebarNavUtils";

export function resolveSelectedL1Code(
  merge: TaxonomyMergeResult,
  domainParam: string | null,
  navParam: string | null
): string {
  const fullMenu = Array.from(merge.domainByL1.values());
  if (domainParam && merge.domainByL1.has(domainParam)) {
    return domainParam;
  }
  if (navParam) {
    const b = findActiveBranchIds(fullMenu, navParam);
    if (b.l1) return b.l1;
  }
  return (
    merge.activeL1Codes[0] ??
    merge.railDomains[0]?.id ??
    merge.secondaryL1Codes[0] ??
    ""
  );
}
