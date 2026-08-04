import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2814: 推奨内容と根拠情報のIDが一致しないとき、エラーを返す", () => {
    const recommendationId = "REC-20240815-001";
    const reasoningId = "REASON-20240815-999";
    const mismatchedReasoningId = "REASON-20240815-999";

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: recommendationId,
        recommendationType: "提案アプローチ",
        content: "顧客の課題に基づいた提案内容",
        confidenceScore: 85,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoningId: mismatchedReasoningId,
        recommendation_id: "REC-20240815-002",
        basis: "過去事例データ",
        relevantCases: ["CASE-001", "CASE-002"],
        explanation: "理由の説明",
      }),
    };

    const input = {
      recommendationId: recommendationId,
      reasoningId: reasoningId,
      aiEngine: mockAIEngine,
    };

    expect(() => displayRecommendationReasoning(input)).toThrow(
      /推奨内容と根拠情報が一致しません/
    );
  });
});