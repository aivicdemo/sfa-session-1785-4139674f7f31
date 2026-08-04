import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターンマッチング評価機能 - 成功パターン適用可能性スコア検証', () => {
  // SCEN-1131
  test('適用可能性スコアが許容閾値100点を超過したとき例外を発生させる', () => {
    const successPattern = {
      industryType: '製造業',
      dealStage: '提案段階',
      proposalContent: 'コスト削減ソリューション',
    };

    const newDealCondition = {
      customerId: 'CUST001',
      customerIndustry: '製造業',
      dealAmount: 5000000,
      currentStage: '提案段階',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    expect(() => {
      evaluatePatternRelevance(
        successPattern,
        newDealCondition,
        mockAIEngine
      );
    }).toThrow(/PatternRelevanceScoreExceedsMaximumThresholdException/);

    try {
      evaluatePatternRelevance(
        successPattern,
        newDealCondition,
        mockAIEngine
      );
    } catch (error: any) {
      expect(error.errorCode).toBe('ERR_PATTERN_SCORE_OVERFLOW');
      expect(error.message).toBe('Applicability score 101 exceeds maximum threshold 100');
      expect(error.detectedScore).toBe(101);
    }
  });
});