import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1956
  test("パターンマッチスコアが閾値ちょうど（0.75）のときにパターンが適用される", () => {
    const dealCondition = {
      customerIndustry: "IT",
      dealStage: "proposal",
      budgetSize: "medium",
      customerId: "CUST-001",
      dealId: "DEAL-001",
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        matchScore: 0.75,
        isApplicable: true,
        patternId: "PAT-IT-MED-001",
        patternName: "IT企業中規模提案パターン",
        approachDescription: "導入効果の数値化による経営層への訴求",
        pastSuccessReferences: [
          { caseId: "CASE-001", successRate: 0.85 },
          { caseId: "CASE-002", successRate: 0.82 },
        ],
      }),
    };

    const result = evaluatePatternRelevance(dealCondition, mockAIEngine);

    expect(result.matchScore).toBe(0.75);
    expect(result.isApplicable).toBe(true);
    expect(result.patternId).toBe("PAT-IT-MED-001");
    expect(result.patternName).toBe("IT企業中規模提案パターン");
    expect(result.approachDescription).toBe(
      "導入効果の数値化による経営層への訴求"
    );
    expect(result.pastSuccessReferences).toHaveLength(2);
    expect(result.pastSuccessReferences[0].successRate).toBe(0.85);
    expect(result.pastSuccessReferences[1].successRate).toBe(0.82);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});