import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件への提案アプローチを自動推奨", () => {
  // SCEN-1606
  test("類似顧客マッチング処理 - 複数の顧客が同じ一致度値を持つとき、すべての該当顧客が特定顧客群に含まれる", () => {
    const mockSimilarCustomers = [
      { customerId: "CUST-001", matchScore: 0.85 },
      { customerId: "CUST-002", matchScore: 0.85 },
      { customerId: "CUST-003", matchScore: 0.85 },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue(mockSimilarCustomers),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCondition = {
      customerId: "CUST-NEW",
      industry: "manufacturing",
      size: "large",
      dealValue: 500000,
    };

    const result = findSimilarPatterns(inputCondition, mockAIEngine);

    result.then((topMatchGroup) => {
      expect(topMatchGroup).toBeDefined();
      expect(topMatchGroup.length).toBe(3);
      expect(topMatchGroup.every((c) => c.matchScore === 0.85)).toBe(true);
      expect(topMatchGroup.map((c) => c.customerId)).toEqual([
        "CUST-001",
        "CUST-002",
        "CUST-003",
      ]);
      expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
        inputCondition
      );
    });
  });
});