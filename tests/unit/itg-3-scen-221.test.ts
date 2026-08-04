import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-221
  test('成功パターンマスタが0件のとき、推奨処理がエラーになる', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue(null),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      industry: '製造業',
      budget: 5000000,
      challenge: '業務効率化',
      companyScale: 'mid_enterprise',
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('errorCode', 'ERR_NO_PATTERN_AVAILABLE');
    expect(result.message).toMatch(/利用可能な成功パターンが存在しません/);
    expect(result.recommendation).toBeNull();
    expect(result.reasoning).toBeUndefined();
    expect(result.statusCode).toBe(400);
    expect(result.logMessage).toMatch(/Pattern master empty - unable to generate recommendation/);
  });
});