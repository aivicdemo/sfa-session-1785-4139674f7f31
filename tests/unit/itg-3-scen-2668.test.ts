import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 適用可能性スコア0のときの不適用判定', () => {
  // SCEN-2668
  test('適用可能性スコアが0のとき、テンプレートは不適用として判定され推奨リストから除外される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: 'template-001',
        relevanceScore: 0,
      }),
    };

    const successPatternTemplate = {
      id: 'template-001',
      name: '大規模案件向け段階的提案アプローチ',
      description: 'Large-scale step-by-step proposal approach',
      createdAt: '2024-01-15T09:00:00Z',
    };

    const newDealData = {
      customerSize: '中堅企業',
      dealAmount: 5000000,
      industry: '製造業',
      dealStage: 'Initial',
    };

    const result = evaluatePatternRelevance(
      successPatternTemplate,
      newDealData,
      mockAIEngine
    );

    expect(result.applicabilityStatus).toBe('INAPPLICABLE');
    expect(result.applicabilityFlag).toBe(false);
    expect(result.relevanceScore).toBe(0);
    expect(result.templateId).toBe('template-001');
    expect(result.shouldBeIncludedInRecommendationList).toBe(false);
  });
});