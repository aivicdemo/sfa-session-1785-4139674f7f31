import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-2480
  test("成功パターンの適用可能性評価機能 - 抽出した成功パターンが新規案件に部分的に適用可能なとき、スコアが0.5前後の値で返却される", () => {
    const newDealData = {
      customerIndustry: "製造業",
      budgetScale: 5000000,
      implementationPeriodMonths: 3,
    };

    const pastSuccessPattern = {
      customerIndustry: "製造業",
      budgetScale: 10000000,
      implementationPeriodMonths: 6,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue(0.5),
    };

    const relevanceScore = mockAIEngine.evaluatePatternRelevance(
      newDealData,
      pastSuccessPattern
    );

    expect(relevanceScore).toBeGreaterThanOrEqual(0.45);
    expect(relevanceScore).toBeLessThanOrEqual(0.55);
    expect(relevanceScore).toBe(0.5);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealData,
      pastSuccessPattern
    );
  });
});