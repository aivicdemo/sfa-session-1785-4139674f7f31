import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1759
  test("根拠抽出期間の開始日と終了日が同日のとき根拠を計算する", () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          "過去の類似顧客パターンとの一致により、このタイミングでのフォローアップが最適と判断されました。成功事例データから、同一業種・規模の顧客は40日前後のサイクルで購買決定している傾向が見られます。",
        relevanceScore: 85,
        extractedPatterns: [
          {
            patternName: "業種別購買周期パターン",
            matchPercentage: 92,
            sourceEventCount: 23,
          },
          {
            patternName: "顧客規模別予算承認時期パターン",
            matchPercentage: 78,
            sourceEventCount: 15,
          },
        ],
      }),
    };

    const startDate = "2026-08-15";
    const endDate = "2026-08-15";

    const reasoningRequest = {
      recommendationId: "rec_20260815_001",
      customerId: "cust_5000",
      dealId: "deal_8700",
      extractPeriodStart: startDate,
      extractPeriodEnd: endDate,
      aiEngine: mockAIRecommendationEngine,
    };

    return explainRecommendationReasoning(reasoningRequest).then((result) => {
      expect(mockAIRecommendationEngine.explainRecommendationReasoning)
        .toHaveBeenCalledTimes(1);

      const callArgs =
        mockAIRecommendationEngine.explainRecommendationReasoning.mock
          .calls[0][0];
      expect(callArgs.extractPeriodStart).toBe("2026-08-15");
      expect(callArgs.extractPeriodEnd).toBe("2026-08-15");

      expect(result).toHaveProperty("reasoning");
      expect(typeof result.reasoning).toBe("string");
      expect(result.reasoning.length).toBeGreaterThan(0);

      expect(result).toHaveProperty("relevanceScore");
      expect(result.relevanceScore).toBe(85);
      expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(result.relevanceScore).toBeLessThanOrEqual(100);

      expect(result).toHaveProperty("extractedPatterns");
      expect(Array.isArray(result.extractedPatterns)).toBe(true);
      expect(result.extractedPatterns.length).toBe(2);

      expect(result.extractedPatterns[0]).toHaveProperty("patternName");
      expect(result.extractedPatterns[0].patternName).toBe(
        "業種別購買周期パターン"
      );
      expect(result.extractedPatterns[0]).toHaveProperty("matchPercentage");
      expect(result.extractedPatterns[0].matchPercentage).toBe(92);
      expect(result.extractedPatterns[0]).toHaveProperty("sourceEventCount");
      expect(result.extractedPatterns[0].sourceEventCount).toBe(23);

      expect(result.extractedPatterns[1]).toHaveProperty("patternName");
      expect(result.extractedPatterns[1].patternName).toBe(
        "顧客規模別予算承認時期パターン"
      );
      expect(result.extractedPatterns[1]).toHaveProperty("matchPercentage");
      expect(result.extractedPatterns[1].matchPercentage).toBe(78);
      expect(result.extractedPatterns[1]).toHaveProperty("sourceEventCount");
      expect(result.extractedPatterns[1].sourceEventCount).toBe(15);
    });
  });
});