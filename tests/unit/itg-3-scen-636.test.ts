import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出機能 - 外部AI推奨エンジン失敗時のフォールバック', () => {
  // SCEN-636
  test('外部AIエンジンのfindSimilarPatternsが失敗したときに内部推奨パターンマスタから代替パターンを返す', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockRejectedValueOnce(new Error('API call failed')),
    };

    const internalPatternMaster = [
      {
        patternId: 'PAT001',
        industry: 'IT',
        successRate: 85,
        patternName: 'IT業界_大型案件_導入型',
      },
      {
        patternId: 'PAT002',
        industry: '金融',
        successRate: 72,
        patternName: '金融業界_システム構築',
      },
      {
        patternId: 'PAT003',
        industry: '製造',
        successRate: 68,
        patternName: '製造業界_効率化提案',
      },
    ];

    const currentDealCondition = {
      customerIndustry: 'IT',
      projectScale: '大型',
    };

    const result = await findSimilarPatterns(
      currentDealCondition,
      mockAIRecommendationEngine,
      internalPatternMaster,
    );

    expect(result).toBeDefined();
    expect(result.patternId).toBe('PAT001');
    expect(result.successRate).toBe(85);
    expect(result.patternName).toBe('IT業界_大型案件_導入型');
    expect(result.simplifiedReasoning).toBeDefined();
    expect(result.simplifiedReasoning).toMatch(/成功率/);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});