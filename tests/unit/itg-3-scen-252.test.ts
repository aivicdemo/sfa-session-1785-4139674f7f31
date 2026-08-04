import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンの適用可能性評価機能", () => {
  // SCEN-252
  test("評価スコアが-0.01のとき、評価処理がエラーになる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.01),
    };

    const dealCondition = {
      customerIndustry: "製造業",
      dealAmount: 5000000,
      dealStage: "提案段階",
    };

    expect(() =>
      evaluatePatternRelevance(dealCondition, mockAIEngine)
    ).toThrow(/評価スコアが無効な範囲です/);
  });
});