import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { validateCustomerInfoAndGenerateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  let mockAIEngine: any;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationPatternId: "REC-001",
        relevanceScore: 0.95,
        recommendationReason:
          "顧客の業種と予算規模から、提案段階での高度な提案アプローチを推奨します",
        successPatterns: [
          {
            patternId: "SP-2024-001",
            description: "製造業向け大型案件の成功パターン",
            matchRate: 0.92,
          },
          {
            patternId: "SP-2024-002",
            description: "予算5M円以上のプロジェクト推進事例",
            matchRate: 0.88,
          },
        ],
        metadata: {
          analysisTimestamp: "2024-01-15T11:00:00Z",
          dataSourceCount: 42,
          confidenceLevel: "high",
        },
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-665
  test("同じ顧客情報で2回検証しても同じ結果が返される", async () => {
    const customerInfo = {
      customerId: "CUST-12345",
      industry: "製造業",
      budget: 5000000,
      dealStage: "提案段階",
    };

    const result1 = await validateCustomerInfoAndGenerateRecommendation(
      customerInfo,
      mockAIEngine
    );

    const result2 = await validateCustomerInfoAndGenerateRecommendation(
      customerInfo,
      mockAIEngine
    );

    expect(result1).toEqual(result2);
    expect(result1.recommendationPatternId).toBe("REC-001");
    expect(result1.relevanceScore).toBe(0.95);
    expect(result1.recommendationReason).toBe(
      "顧客の業種と予算規模から、提案段階での高度な提案アプローチを推奨します"
    );
    expect(result1.successPatterns).toEqual([
      {
        patternId: "SP-2024-001",
        description: "製造業向け大型案件の成功パターン",
        matchRate: 0.92,
      },
      {
        patternId: "SP-2024-002",
        description: "予算5M円以上のプロジェクト推進事例",
        matchRate: 0.88,
      },
    ]);
    expect(result1.metadata).toEqual({
      analysisTimestamp: "2024-01-15T11:00:00Z",
      dataSourceCount: 42,
      confidenceLevel: "high",
    });
    expect(result2.recommendationPatternId).toBe("REC-001");
    expect(result2.relevanceScore).toBe(0.95);
    expect(result2.recommendationReason).toBe(
      "顧客の業種と予算規模から、提案段階での高度な提案アプローチを推奨します"
    );
    expect(result2.successPatterns).toEqual([
      {
        patternId: "SP-2024-001",
        description: "製造業向け大型案件の成功パターン",
        matchRate: 0.92,
      },
      {
        patternId: "SP-2024-002",
        description: "予算5M円以上のプロジェクト推進事例",
        matchRate: 0.88,
      },
    ]);
    expect(result2.metadata).toEqual({
      analysisTimestamp: "2024-01-15T11:00:00Z",
      dataSourceCount: 42,
      confidenceLevel: "high",
    });
  });
});