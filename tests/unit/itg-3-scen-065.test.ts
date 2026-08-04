import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("パターン適用可能性評価機能", () => {
  test("SCEN-065: 適用可能性スコアがちょうど0の場合に結果が正常に返される", () => {
    const dealCondition = {
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealAmount: 5000000,
      dealPhase: "提案段階",
      dealType: "新規案件",
    };

    const successPattern = {
      patternId: "pattern-001",
      industry: "製造業",
      scale: "中堅企業",
      amountRange: { min: 3000000, max: 8000000 },
      phase: "提案段階",
      successRate: 0.75,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      successPattern,
      mockAIEngine
    );

    expect(result.score).toBe(0.0);
    expect(result.status).toBe("success");
    expect(result.error).toBeNull();
    expect(result.evaluation).toBe("適用不可");
    expect(result.reason).toBe("パターンの適用可能性がありません");
  });
});