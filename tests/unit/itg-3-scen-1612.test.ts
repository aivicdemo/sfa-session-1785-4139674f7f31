import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理 - 購買金額が業務上の最大規模のとき", () => {
  test("SCEN-1612: 購買金額の最大規模でのマッチング計算がオーバーフローなく正常に処理される", async () => {
    const maxPurchaseAmount = 999999999999;
    const customerAttributes = {
      industry: "製造業",
      companySize: "大企業",
      region: "関東",
    };

    const pastCustomersData = Array.from({ length: 100 }, (_, index) => ({
      customerId: `past_customer_${index + 1}`,
      industry: "製造業",
      companySize: "大企業",
      region: "関東",
      purchaseAmount: Math.floor(Math.random() * 500000000000),
      lastPurchaseDate: "2024-01-15",
      purchaseFrequency: Math.floor(Math.random() * 12) + 1,
    }));

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(pastCustomersData),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await findSimilarPatterns(
      {
        industry: customerAttributes.industry,
        companySize: customerAttributes.companySize,
        region: customerAttributes.region,
        purchaseAmount: maxPurchaseAmount,
        targetDate: "2024-01-15",
      },
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(100);

    for (const item of result) {
      expect(item.similarityScore).toBeGreaterThanOrEqual(0.0);
      expect(item.similarityScore).toBeLessThanOrEqual(1.0);
      expect(typeof item.similarityScore).toBe("number");
      expect(isFinite(item.similarityScore)).toBe(true);
      expect(item.similarityScore).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    }

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeLessThanOrEqual(
        result[i + 1].similarityScore
      );
    }

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        purchaseAmount: maxPurchaseAmount,
      })
    );
  });
});