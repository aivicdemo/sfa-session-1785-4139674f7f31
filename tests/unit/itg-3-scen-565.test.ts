import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 適用可能スコア判定', () => {
  // SCEN-565
  test('適用可能スコアが閾値0.5未満のとき成功パターンが適用不可と判定される', () => {
    const dealCondition = {
      customerIndustry: '製造業',
      budgetScale: '中堅企業',
      dealStage: '提案前',
    };

    const successPattern = {
      id: 'pattern_001',
      customerIndustry: '製造業',
      budgetScale: '中堅企業',
      dealStage: '提案前',
      approachName: '長期パートナーシップ構築型',
      successRate: 0.72,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.45,
        matchDetails: {
          industryMatch: 1.0,
          budgetMatch: 0.9,
          stageMatch: 0.0,
        },
      }),
    };

    const result = evaluatePatternRelevance(dealCondition, successPattern, mockAIEngine);

    expect(result.applicableFlag).toBe('NOT_APPLICABLE');
    expect(result.relevanceScore).toBe(0.45);
    expect(result.message).toMatch(/参考情報/);
    expect(result.shouldExcludeFromRecommendation).toBe(true);
  });
});