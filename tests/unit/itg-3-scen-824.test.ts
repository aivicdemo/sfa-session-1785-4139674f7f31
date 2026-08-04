import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-824: [error] 推奨内容の信頼度スコア算出・根拠提示機能 - フォローアップ成功パターンデータが null のとき、エラーで処理が進まない
  test('should throw error and return fallback pattern when followup success pattern data is null', async () => {
    const customerInfo = {
      industry: 'IT',
      employeeCount: 500,
    };

    const dealCondition = {
      budget: 50000000,
      desiredImplementationPeriod: '3ヶ月以内',
    };

    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue(null),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const internalPatternMasterFallback = {
      recommendationPattern: '最適な提案パターン',
      confidenceScore: 65,
      simplifiedReason: 'システム推奨パターンマスタより最適提案を選定しました',
    };

    let thrownError: Error | null = null;
    let result: any = null;

    try {
      result = await calculateRecommendationConfidenceScore(
        customerInfo,
        dealCondition,
        aiRecommendationEngineStub,
        internalPatternMasterFallback
      );
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError?.message).toMatch(/フォローアップ成功パターンデータ/);
    expect(result).toBeUndefined();
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      customerInfo,
      dealCondition
    );
  });
});