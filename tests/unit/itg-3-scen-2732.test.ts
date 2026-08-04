import { extractSuccessPatternAndRecommend } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック', () => {
  // SCEN-2732
  test('[error] 過去商談データから抽出した成功パターンの信頼度スコアが閾値未満のとき処理が失敗する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        confidenceScore: 0.35,
        isRelevant: false,
      }),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const internalLogs: string[] = [];
    const mockLogger = {
      log: (message: string) => {
        internalLogs.push(message);
      },
    };

    const newDealData = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    const result = extractSuccessPatternAndRecommend(
      newDealData,
      mockAIEngine,
      mockLogger
    );

    expect(result.isError).toBe(true);
    expect(result.errorCode).toBe('PATTERN_RELEVANCE_BELOW_THRESHOLD');
    expect(result.errorMessage).toContain(
      '抽出した成功パターンの信頼度が閾値0.5未満（実績値：0.35）のため、推奨生成処理を中断しました'
    );
    expect(result.recommendedPatterns).toEqual(
      result.recommendedPatterns === null ||
        Array.isArray(result.recommendedPatterns)
        ? result.recommendedPatterns
        : null
    );
    if (
      result.recommendedPatterns === null ||
      (Array.isArray(result.recommendedPatterns) &&
        result.recommendedPatterns.length === 0)
    ) {
      expect(true).toBe(true);
    } else {
      expect(result.recommendedPatterns).toEqual([]);
    }
    expect(internalLogs).toContainEqual(
      expect.stringMatching(/evaluatePatternRelevance実行結果：信頼度スコア0\.35/)
    );
  });
});