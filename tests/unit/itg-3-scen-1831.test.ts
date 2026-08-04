import { generateRecommendationWithReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1831: [normal] 推奨根拠情報の統合機能 - 根拠情報に推奨生成日時がタイムスタンプで記録される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客の成長段階に合わせた段階的提案",
        confidenceScore: 85,
        baselinePatterns: [
          {
            patternId: "pat-001",
            customerSegment: "中堅企業",
            matchScore: 0.92,
            successRate: 0.78,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: "case-2025-001",
          similarity: 0.88,
          outcome: "success",
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "過去の類似案件で成功した提案アプローチを適用。顧客の業種・規模・課題パターンが過去事例と合致"
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const newDealInput = {
      customerId: "cust-2026-001",
      customerName: "テスト顧客株式会社",
      industry: "製造業",
      companySize: "中堅企業",
      businessChallenge: "デジタル化による業務効率化",
      dealStage: "initial_contact",
      dealValue: 5000000,
      dealTimeline: "2026-09-30",
    };

    const testExecutionTime = new Date();

    const result = generateRecommendationWithReasoning(newDealInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendationReasoningInfo).toBeDefined();
    expect(result.recommendationReasoningInfo.generatedAt).toBeDefined();

    const generatedAtTimestamp = result.recommendationReasoningInfo.generatedAt;
    expect(typeof generatedAtTimestamp).toBe("string");

    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(generatedAtTimestamp).toMatch(iso8601Regex);

    const generatedAtDate = new Date(generatedAtTimestamp);
    const timeDifferenceMs = Math.abs(
      generatedAtDate.getTime() - testExecutionTime.getTime()
    );
    expect(timeDifferenceMs).toBeLessThanOrEqual(5000);

    expect(result.recommendationReasoningInfo.recommendedApproach).toBeDefined();
    expect(result.recommendationReasoningInfo.reasoning).toBeDefined();
    expect(result.recommendationReasoningInfo.confidenceScore).toBe(85);
    expect(result.recommendationReasoningInfo.baselinePatterns).toBeDefined();
    expect(Array.isArray(result.recommendationReasoningInfo.baselinePatterns)).toBe(
      true
    );
  });
});