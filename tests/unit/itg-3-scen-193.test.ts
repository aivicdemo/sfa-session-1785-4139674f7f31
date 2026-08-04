import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨', () => {
  // SCEN-193
  test('内部パターンマスタ統計集計機能 - 全成功パターンから統計的に上位の提案アプローチが複数件抽出される', async () => {
    const mockPatternA = {
      patternId: 'PAT001',
      patternName: 'パターンA',
      successCount: 120,
      adoptionRate: 85,
      successFlag: true,
      statisticalScore: 120 * (85 / 100),
    };

    const mockPatternB = {
      patternId: 'PAT002',
      patternName: 'パターンB',
      successCount: 95,
      adoptionRate: 78,
      successFlag: true,
      statisticalScore: 95 * (78 / 100),
    };

    const mockPatternC = {
      patternId: 'PAT003',
      patternName: 'パターンC',
      successCount: 88,
      adoptionRate: 72,
      successFlag: true,
      statisticalScore: 88 * (72 / 100),
    };

    const mockPatternD = {
      patternId: 'PAT004',
      patternName: 'パターンD',
      successCount: 45,
      adoptionRate: 68,
      successFlag: true,
      statisticalScore: 45 * (68 / 100),
    };

    const mockPatternE = {
      patternId: 'PAT005',
      patternName: 'パターンE',
      successCount: 30,
      adoptionRate: 55,
      successFlag: true,
      statisticalScore: 30 * (55 / 100),
    };

    const allSuccessPatterns = [
      mockPatternA,
      mockPatternB,
      mockPatternC,
      mockPatternD,
      mockPatternE,
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(allSuccessPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealConditions = {
      customerIndustry: 'IT',
      customerSize: 'large',
      dealAmount: 5000000,
    };

    const result = await findSimilarPatterns(dealConditions, mockAIEngine);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      patternId: 'PAT001',
      patternName: 'パターンA',
      successCount: 120,
      adoptionRate: 85,
      successFlag: true,
      statisticalScore: 102,
    });

    expect(result[1]).toEqual({
      patternId: 'PAT002',
      patternName: 'パターンB',
      successCount: 95,
      adoptionRate: 78,
      successFlag: true,
      statisticalScore: 74.1,
    });

    expect(result[2]).toEqual({
      patternId: 'PAT003',
      patternName: 'パターンC',
      successCount: 88,
      adoptionRate: 72,
      successFlag: true,
      statisticalScore: 63.36,
    });

    expect(result.map((p) => p.patternId)).not.toContain('PAT004');
    expect(result.map((p) => p.patternId)).not.toContain('PAT005');
  });
});