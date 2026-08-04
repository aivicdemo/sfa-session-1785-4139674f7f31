import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-203
  test("[normal] OpenAI APIが正常に応答するとき、詳細な根拠説明が自然言語で生成される", async () => {
    const recommendationId = "rec_20240115_001";
    const customerIndustry = "製造業";
    const customerDecisionCycle = 22;
    const similarPatternsCount = 3;
    const conversionRateInWindow = 1.0;
    const followupDays = 21;

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          "顧客業界は製造業で、過去12ヶ月の類似案件3件すべてが提案から3週間以内の初回フォローで成約に至っている。貴社の顧客も同じ業界セグメントであり、意思決定サイクルが22日と類似している。したがって初回接触後3週間での集中的なフォローアップが推奨される。",
        confidence: 0.87,
        relatedPatterns: [
          "pattern_id_001",
          "pattern_id_002",
          "pattern_id_003",
        ],
      }),
    };

    const recommendationInput = {
      recommendationId: recommendationId,
      customerIndustry: customerIndustry,
      customerDecisionCycle: customerDecisionCycle,
      similarPatternsCount: similarPatternsCount,
      conversionRateInWindow: conversionRateInWindow,
      followupDays: followupDays,
    };

    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAIEngine
    );

    expect(result.reasoning).toBe(
      "顧客業界は製造業で、過去12ヶ月の類似案件3件すべてが提案から3週間以内の初回フォローで成約に至っている。貴社の顧客も同じ業界セグメントであり、意思決定サイクルが22日と類似している。したがって初回接触後3週間での集中的なフォローアップが推奨される。"
    );
    expect(result.confidence).toBe(0.87);
    expect(result.relatedPatterns).toEqual([
      "pattern_id_001",
      "pattern_id_002",
      "pattern_id_003",
    ]);
    expect(result.relatedPatterns.length).toBe(3);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );
  });
});