import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1898
  test("推奨内容の生成タイムスタンプが null のとき推奨に失敗する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチ A",
        confidenceScore: 85,
        timestamp: null,
        reasoningData: {
          similarPatterns: ["case_001", "case_002"],
          successFactors: ["要因 1", "要因 2"]
        }
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_top_1",
          matchScore: 92,
          description: "統計的に上位の成功パターン 1"
        },
        {
          patternId: "pattern_top_2",
          matchScore: 88,
          description: "統計的に上位の成功パターン 2"
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    const mockPatternMaster = [
      {
        patternId: "pattern_top_1",
        matchScore: 92,
        description: "統計的に上位の成功パターン 1"
      },
      {
        patternId: "pattern_top_2",
        matchScore: 88,
        description: "統計的に上位の成功パターン 2"
      }
    ];

    const inputData = {
      customerId: "cust_12345",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealAmount: 5000000,
      dealStage: "提案段階",
      productCategory: "システム導入",
      operatingContext: {
        operatingSystemType: "On-Premise",
        scalabilityRequirement: "High"
      }
    };

    const errorLog: string[] = [];
    const originalConsoleError = console.error;
    console.error = jest.fn((msg: string) => {
      errorLog.push(msg);
    });

    const result = generateRecommendation(
      inputData,
      mockAIEngine,
      mockPatternMaster
    );

    console.error = originalConsoleError;

    expect(result).toMatchObject({
      success: false,
      errorCode: "RECOMMENDATION_TIMESTAMP_INVALID",
      userMessage: "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      fallbackPatterns: [
        {
          patternId: "pattern_top_1",
          matchScore: 92,
          description: "統計的に上位の成功パターン 1"
        },
        {
          patternId: "pattern_top_2",
          matchScore: 88,
          description: "統計的に上位の成功パターン 2"
        }
      ]
    });

    expect(errorLog.some((log) =>
      log.includes("Recommendation timestamp validation failed: timestamp is null")
    )).toBe(true);
  });
});