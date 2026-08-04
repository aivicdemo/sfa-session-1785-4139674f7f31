import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2468
  test("推奨内容が1件存在するとき、対応する根拠が正しく表示される", async () => {
    const recommendationId = "rec_20240115_001";
    const expectedReasoningText =
      "過去成功パターン: 同業種・同規模顧客への導入実績3件。" +
      "マッチスコア: 87点。" +
      "適用理由: 顧客の経営課題（業務効率化）が過去成功事例と合致。" +
      "推奨アクション: 初回打ち合わせで具体的な課題ヒアリング、ROI試算提示を実施。";

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        proposalApproach:
          "顧客の経営課題を踏まえた段階的な導入提案アプローチ",
        successPatternName: "同業種同規模企業への段階的導入パターン",
        matchScore: 87,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        reasoningText: expectedReasoningText,
        pastSuccessPatterns: [
          {
            patternName: "同業種・同規模顧客への導入実績3件",
            matchCount: 3,
          },
        ],
        matchScore: 87,
        applicationReason:
          "顧客の経営課題（業務効率化）が過去成功事例と合致",
        recommendedAction:
          "初回打ち合わせで具体的な課題ヒアリング、ROI試算提示を実施",
      }),
    };

    const result = await explainRecommendationReasoning(
      mockAIRecommendationEngine,
      recommendationId
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );
    expect(result.recommendationId).toBe(recommendationId);
    expect(result.reasoningText).toBe(expectedReasoningText);
    expect(result.matchScore).toBe(87);
    expect(result.pastSuccessPatterns).toHaveLength(1);
    expect(result.pastSuccessPatterns[0].patternName).toBe(
      "同業種・同規模顧客への導入実績3件"
    );
    expect(result.pastSuccessPatterns[0].matchCount).toBe(3);
    expect(result.applicationReason).toBe(
      "顧客の経営課題（業務効率化）が過去成功事例と合致"
    );
    expect(result.recommendedAction).toBe(
      "初回打ち合わせで具体的な課題ヒアリング、ROI試算提示を実施"
    );
  });
});