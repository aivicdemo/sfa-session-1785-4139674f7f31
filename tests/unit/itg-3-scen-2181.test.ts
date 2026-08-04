import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("顧客対応パターンと成功パターンのマッチスコア算出", () => {
  // SCEN-2181
  test("マッチスコア 0.01% のとき、繰り上げ処理により最終スコアが 1 以上になる", async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.0001),
    };

    const customerPattern = {
      proposalContent: "営業担当者の提案内容",
      customerResponseBehavior: "顧客対応パターン",
    };

    const successPattern = {
      customerAttribute: "顧客属性",
      dealCondition: "商談条件",
      successFactor: "成功要因",
    };

    const result = await evaluatePatternRelevance(
      customerPattern,
      successPattern,
      mockAIEngine
    );

    expect(result).toBe(1);
  });
});