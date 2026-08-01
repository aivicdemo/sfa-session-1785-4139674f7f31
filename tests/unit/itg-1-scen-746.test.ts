import { selectBehaviorPatternAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定機能", () => {
  // SCEN-746: [edge] 行動パターン分析対象指標の自動選定機能 - 成約実績が1件の場合、その成約実績との相関から指標が補完される
  test("成約実績1件から指標を自動補完する", () => {
    const salesRepresentativeId = "rep-001";
    const contractResults = [
      {
        contractAmount: 5000000,
        negotiationPeriodDays: 30,
        proposalDocumentPages: 15,
      },
    ];

    const result = selectBehaviorPatternAnalysisIndicators(
      salesRepresentativeId,
      contractResults
    );

    expect(result.selectedIndicators).toContain("proposalDocumentPages");
    expect(result.selectedIndicators).toContain("negotiationPeriodDays");
    expect(result.selectedIndicators).toContain("contractAmount");
    expect(result.selectedIndicators.length).toBe(3);
    expect(result.contractAmountValue).toBe(5000000);
    expect(result.negotiationPeriodDaysValue).toBe(30);
    expect(result.proposalDocumentPagesValue).toBe(15);
  });
});