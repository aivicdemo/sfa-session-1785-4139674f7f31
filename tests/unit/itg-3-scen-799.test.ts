import { generateRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-799: 推奨根拠データ生成機能 - 顧客条件マッチング度が根拠として営業担当者に提示される", () => {
    const customerCondition = {
      industry: "製造業",
      employeeCount: 500,
      businessChallenge: "生産効率化",
    };

    const pastSuccessPatterns = [
      {
        patternId: "pattern_001",
        industry: "製造業",
        employeeCount: 480,
        businessChallenge: "生産効率化",
        approach: "自動化導入と業務プロセス最適化",
        matchScore: 0.92,
      },
      {
        patternId: "pattern_002",
        industry: "製造業",
        employeeCount: 520,
        businessChallenge: "生産効率化",
        approach: "デジタル化推進とデータ活用",
        matchScore: 0.87,
      },
      {
        patternId: "pattern_003",
        industry: "製造業",
        employeeCount: 500,
        businessChallenge: "生産効率化",
        approach: "人材育成と標準化",
        matchScore: 0.81,
      },
    ];

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern) => {
        const matchMap: { [key: string]: number } = {
          pattern_001: 0.92,
          pattern_002: 0.87,
          pattern_003: 0.81,
        };
        return matchMap[pattern.patternId] || 0;
      }),

      explainRecommendationReasoning: jest.fn(() => {
        return "顧客の業種・規模が過去成功事例と92%マッチしており、同様のアプローチが有効と判断されます。具体的には、マッチ度0.92の事例では自動化導入、マッチ度0.87の事例ではデジタル化推進、マッチ度0.81の事例では人材育成が成功要因となっています。";
      }),

      generateRecommendation: jest.fn(() => ({
        recommendedApproach: "自動化導入と業務プロセス最適化",
        confidence: 0.92,
      })),

      findSimilarPatterns: jest.fn(() => pastSuccessPatterns),
    };

    const result = generateRecommendationWithReasoning(
      customerCondition,
      mockAIRecommendationEngine
    );

    expect(result.recommendedApproach).toBe("自動化導入と業務プロセス最適化");

    expect(result.reasoningExplanation).toContain("92%マッチ");
    expect(result.reasoningExplanation).toContain("マッチ度0.92");
    expect(result.reasoningExplanation).toContain("マッチ度0.87");
    expect(result.reasoningExplanation).toContain("マッチ度0.81");

    expect(result.matchingScores).toEqual([0.92, 0.87, 0.81]);

    expect(result.reasoningExplanation).toContain(
      "顧客の業種・規模が過去成功事例と92%マッチしており、同様のアプローチが有効と判断されます。"
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      customerCondition
    );
  });
});