import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンの適用可能性評価機能", () => {
  // SCEN-253
  test("評価スコアが100.1を超過したとき、エラーハンドリングされる", async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 100.1,
        isRelevant: true,
      }),
    };

    const dealCondition = {
      customerId: "CUST001",
      industryType: "IT",
      companySize: "large",
      purchaseHistory: [],
    };

    const successPattern = {
      patternId: "SP001",
      matchingCustomerType: "IT",
      matchingCompanySize: "large",
    };

    await expect(
      evaluatePatternRelevance(dealCondition, successPattern, mockAIEngine)
    ).rejects.toThrow(/EVALUATION_SCORE_OUT_OF_RANGE/);
  });
});