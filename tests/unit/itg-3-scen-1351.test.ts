import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1351
  test("推奨根拠が1件のとき、その1つの根拠に基づいた説明文が生成される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC_001",
        proposedApproach: "標準的な提案アプローチ",
        reasons: [
          {
            reasonId: "REASON_001",
            pattern: "顧客規模5000人以上の製造業",
            successRate: 0.87,
            frequency: 23,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "過去の成功事例から、顧客規模5000人以上の製造業では、本提案アプローチの成約率が87%と高い実績があります。（過去23件の商談データから統計）"
      ),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputReasonData = {
      reasonId: "REASON_001",
      pattern: "顧客規模5000人以上の製造業",
      successRate: 0.87,
      frequency: 23,
    };

    const generatedExplanation = mockAIRecommendationEngine.explainRecommendationReasoning(
      inputReasonData
    );

    expect(generatedExplanation).resolves.toEqual(
      "過去の成功事例から、顧客規模5000人以上の製造業では、本提案アプローチの成約率が87%と高い実績があります。（過去23件の商談データから統計）"
    );

    const result = generatedExplanation;

    return result.then((explanation: string) => {
      expect(explanation).toContain("5000人以上の製造業");
      expect(explanation).toContain("87%");
      expect(explanation).toContain("過去23件");
      expect(explanation).toMatch(/営業担当者|成功事例|成約率/);
      expect(explanation).not.toMatch(/一方|他方|これに対して|むしろ/);
      expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
        inputReasonData
      );
    });
  });
});