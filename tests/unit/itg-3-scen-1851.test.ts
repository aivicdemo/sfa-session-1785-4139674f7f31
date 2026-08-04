import { evaluatePatternRelevanceAndExplainReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1851: 成功パターンマッチスコアが null のとき根拠情報の生成に失敗する", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternMatchScore: null,
        applicablePatterns: [],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockCachePatterns = [
      {
        patternId: "PAT-MANU-001",
        industryType: "製造業",
        successRate: 0.78,
        description: "製造業向けシステムソリューション提案パターン",
      },
    ];

    const customerId = "CUST-001";
    const dealCondition = {
      industryType: "製造業",
      budget: 5000000,
      productCategory: "システムソリューション",
    };

    let capturedError: Error | null = null;
    let capturedUIMessage: string | null = null;
    let capturedCachedPatterns: typeof mockCachePatterns | null = null;

    try {
      const result = evaluatePatternRelevanceAndExplainReasoning(
        customerId,
        dealCondition,
        mockAIEngine,
        mockFileStorage,
        mockCachePatterns
      );

      if (result.status === "error") {
        capturedError = new Error(result.errorLog);
        capturedUIMessage = result.uiMessage;
        capturedCachedPatterns = result.cachedPatterns;
      }
    } catch (error) {
      capturedError = error as Error;
    }

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerId,
      dealCondition
    );

    expect(capturedError).not.toBeNull();
    expect(capturedError?.message).toMatch(/根拠/);

    expect(capturedUIMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    expect(capturedCachedPatterns).toEqual(mockCachePatterns);

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});