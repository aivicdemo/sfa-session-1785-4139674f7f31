import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-921
  test("[edge] 推奨根拠説明生成機能 - 根拠説明の説明テキストが複数文のとき正しく生成される", () => {
    const mockRecommendationId = "rec_12345";
    const multiSentenceExplanation =
      "顧客の業界は製造業で、過去3年間の成功事例では同業界への提案が78%の成約率を記録しています。また、提案金額帯が500万円から1000万円の案件では、導入支援サービスのセット提案が成功パターンとして確認されています。当社の営業プロセスに基づくと、このタイミングでのフォローアップが最適であると判定されました。";

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: multiSentenceExplanation,
        confidence: 0.82,
        sourcePatterns: ["manufacturing_78pct", "budget_500m_1000m_support"],
      }),
    };

    const result = explainRecommendationReasoning(
      mockRecommendationId,
      mockAIEngine
    );

    const expectedExplanation =
      "顧客の業界は製造業で、過去3年間の成功事例では同業界への提案が78%の成約率を記録しています。また、提案金額帯が500万円から1000万円の案件では、導入支援サービスのセット提案が成功パターンとして確認されています。当社の営業プロセスに基づくと、このタイミングでのフォローアップが最適であると判定されました。";

    expect(result.explanation).toEqual(expectedExplanation);
    expect(result.explanation.length).toBe(expectedExplanation.length);

    const sentenceCount = (result.explanation.match(/。/g) || []).length;
    expect(sentenceCount).toBeGreaterThanOrEqual(3);

    expect(result.explanation).toContain("製造業");
    expect(result.explanation).toContain("78%");
    expect(result.explanation).toContain("500万円");
    expect(result.explanation).toContain("1000万円");
    expect(result.explanation).toContain("導入支援サービス");

    expect(result.confidence).toBe(0.82);
    expect(Array.isArray(result.sourcePatterns)).toBe(true);
    expect(result.sourcePatterns.length).toBe(2);

    const encodedExplanation = Buffer.from(
      result.explanation,
      "utf8"
    ).toString("utf8");
    expect(encodedExplanation).toEqual(expectedExplanation);

    mockAIEngine.explainRecommendationReasoning.mockClear();
  });
});