import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件へ自動推奨する機能', () => {
  // SCEN-196
  test('外部API失敗かつマッチング0件のとき、内部推奨パターンマスタから統計的上位パターンを代替返却', async () => {
    const newDealCondition = {
      industryType: '製造業',
      budgetAmount: 50000000,
      implementationPeriod: 3,
      businessChallenge: '業務効率化',
    };

    const internalPatternMaster = [
      {
        patternId: 'P001',
        successRate: 0.87,
        caseCount: 234,
        description: '過去事例から最も成功率の高いアプローチです',
      },
      {
        patternId: 'P002',
        successRate: 0.82,
        caseCount: 156,
        description: '次点の成功パターン',
      },
      {
        patternId: 'P003',
        successRate: 0.75,
        caseCount: 98,
        description: '代替パターン',
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(async () => {
        return [];
      }),
      generateRecommendation: jest.fn(async () => {
        throw new Error('API timeout');
      }),
    };

    const result = await generateRecommendation(
      newDealCondition,
      internalPatternMaster,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();

    expect(result.recommendedPattern).toBeDefined();
    expect(result.recommendedPattern.patternId).toBe('P001');
    expect(result.recommendedPattern.source).toBe('internal_master');
    expect(result.recommendedPattern.successRate).toBe(0.87);
    expect(result.recommendedPattern.reasoning).toBe(
      '過去事例から最も成功率の高いアプローチです'
    );

    expect(result.recommendedPattern).toMatchObject({
      patternId: 'P001',
      source: 'internal_master',
      successRate: 0.87,
    });
  });
});