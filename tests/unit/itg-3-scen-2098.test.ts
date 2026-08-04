import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  analyzeProposalAndCustomerPattern,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  let mockAIRecommendationEngine: any;
  let mockOperationLogsDb: any;
  let systemTime: Date;

  beforeEach(() => {
    systemTime = new Date("2025-06-15T14:32:45.123Z");
    
    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案資料の事前送付 + 初回商談予約",
        trustScore: 85,
        reasoning: {
          customerProfile: {
            companyName: "テスト商社A",
            industry: "製造業",
            budgetSize: 5000000,
          },
          similarPatterns: [
            {
              pastCaseId: "CASE_2025_001",
              similarity: 0.92,
              successRate: 0.88,
            },
          ],
          recommendationReasoning:
            "顧客属性と予算規模から、事前資料送付による信頼構築が有効",
        },
      }),
    };

    mockOperationLogsDb = {
      insertLog: jest.fn().mockResolvedValue({ id: "LOG_001" }),
      findLogsByUserAndType: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2098
  test("提案内容と顧客対応パターンの標準プロセス照合分析 - 営業担当者の操作ログから提案実行タイミングが正確に記録される", async () => {
    const userId = "TEST_SALES_001";
    const dealId = "DEAL_2025_001";
    const recommendationExecutedTime = new Date("2025-06-15T14:32:45.123Z");
    const proposalExecutedTime = new Date("2025-06-15T14:33:12.456Z");

    const customerInfo = {
      companyName: "テスト商社A",
      industry: "製造業",
      budgetSize: 5000000,
    };

    const recommendationResult =
      await mockAIRecommendationEngine.generateRecommendation({
        customerId: "CUST_001",
        dealId: dealId,
        customerInfo: customerInfo,
      });

    await mockOperationLogsDb.insertLog({
      operationType: "RECOMMENDATION_EXECUTED",
      userId: userId,
      dealId: dealId,
      recommendationContent: recommendationResult.recommendedApproach,
      timestamp: recommendationExecutedTime,
    });

    const proposalExecutionLog = {
      operationType: "PROPOSAL_EXECUTED",
      userId: userId,
      dealId: dealId,
      executionContent: "提案資料の事前送付手配",
      timestamp: proposalExecutedTime,
    };

    await mockOperationLogsDb.insertLog(proposalExecutionLog);

    const recommendationLogs = [
      {
        operationType: "RECOMMENDATION_EXECUTED",
        userId: userId,
        dealId: dealId,
        recommendationContent: "提案資料の事前送付 + 初回商談予約",
        timestamp: recommendationExecutedTime,
      },
    ];

    const proposalLogs = [proposalExecutionLog];

    mockOperationLogsDb.findLogsByUserAndType.mockImplementation(
      (type: string) => {
        if (type === "RECOMMENDATION_EXECUTED") return recommendationLogs;
        if (type === "PROPOSAL_EXECUTED") return proposalLogs;
        return [];
      }
    );

    const analysisInput = {
      userId: userId,
      dealId: dealId,
      customerInfo: customerInfo,
      proposalContent: {
        approach: "提案資料の事前送付 + 初回商談予約",
        methodology: "標準プロセス準拠",
      },
      operationLogsDb: mockOperationLogsDb,
      aiRecommendationEngine: mockAIRecommendationEngine,
      currentSystemTime: new Date("2025-06-15T14:34:00.000Z"),
    };

    const result = await analyzeProposalAndCustomerPattern(analysisInput);

    expect(result).toBeDefined();
    expect(result.analysisResult).toBeDefined();
    expect(result.analysisResult.operationTimings).toBeDefined();

    const recommendationTiming =
      result.analysisResult.operationTimings.recommendationExecutedAt;
    const proposalTiming =
      result.analysisResult.operationTimings.proposalExecutedAt;

    expect(recommendationTiming).toBe("2025-06-15T14:32:45.123Z");
    expect(proposalTiming).toBe("2025-06-15T14:33:12.456Z");

    const recommendationTimeDiff = Math.abs(
      new Date(recommendationTiming).getTime() - recommendationExecutedTime.getTime()
    );
    const proposalTimeDiff = Math.abs(
      new Date(proposalTiming).getTime() - proposalExecutedTime.getTime()
    );

    expect(recommendationTimeDiff).toBeLessThanOrEqual(500);
    expect(proposalTimeDiff).toBeLessThanOrEqual(500);

    expect(result.analysisResult.recordedLogs).toEqual({
      recommendationLog: {
        operationType: "RECOMMENDATION_EXECUTED",
        userId: userId,
        dealId: dealId,
        recommendationContent: "提案資料の事前送付 + 初回商談予約",
        timestamp: "2025-06-15T14:32:45.123Z",
      },
      proposalLog: {
        operationType: "PROPOSAL_EXECUTED",
        userId: userId,
        dealId: dealId,
        executionContent: "提案資料の事前送付手配",
        timestamp: "2025-06-15T14:33:12.456Z",
      },
    });

    expect(result.analysisResult.timestampAccuracy).toEqual({
      recommendationAccuracyMs: 0,
      proposalAccuracyMs: 0,
      bothWithin500MsThreshold: true,
    });

    expect(result.analysisResult.proposalAlignmentScore).toBeGreaterThanOrEqual(
      0
    );
    expect(result.analysisResult.proposalAlignmentScore).toBeLessThanOrEqual(
      100
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: dealId,
        customerInfo: customerInfo,
      })
    );

    expect(mockOperationLogsDb.insertLog).toHaveBeenCalledTimes(2);
  });
});