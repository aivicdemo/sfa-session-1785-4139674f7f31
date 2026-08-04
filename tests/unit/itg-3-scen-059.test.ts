import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-059: OpenAI API呼び出し失敗時に簡略版根拠説明が返される", async () => {
    fetchMock.resetMocks();

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValueOnce(
        new Error("API connection timeout")
      ),
    };

    const testRecommendation = {
      recommendationId: "REC-2024-001",
      customerId: "CUST-12345",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealCondition: {
        dealId: "DEAL-2024-001",
        dealStatus: "proposal_phase",
        dealAmount: 5000000,
      },
      proposedApproach: "提案型営業",
      successPatternId: "SP-0001",
      confidenceScore: 85,
      createdAt: new Date("2024-01-15T10:00:00Z"),
    };

    const mockPatternMasterResponse = {
      successPatterns: [
        {
          patternId: "SP-0001",
          description: "過去の成功事例から統計的に選定された標準的なアプローチ",
          successRate: 0.78,
          applicableIndustries: ["製造業", "流通業"],
          tacticalElements: ["提案型営業", "顧客ニーズ把握"],
        },
        {
          patternId: "SP-0002",
          description: "コンサルティング型アプローチによる深掘り営業",
          successRate: 0.72,
          applicableIndustries: ["金融業", "製造業"],
          tacticalElements: ["コンサル型", "経営課題解決"],
        },
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockPatternMasterResponse), {
      status: 200,
    });

    const result = await explainRecommendationReasoning(
      testRecommendation,
      mockAIEngine
    );

    expect(result.statusCode).toBe(200);
    expect(result.error).toBeNull();
    expect(result.reasoningExplanation).toBe(
      "過去の成功事例から統計的に選定された標準的なアプローチ"
    );
    expect(result.reasoningExplanation).not.toBe("");
    expect(result.isSimplifiedVersion).toBe(true);
    expect(result.sourceType).toBe("pattern_master");
    expect(result.recommendationId).toBe("REC-2024-001");
  });
});