import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2067
  test('パターン適用可能性評価がOpenAI APIで失敗した場合、デフォルトスコア0.5が使用される', async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('OpenAI API timeout')
      ),
    };

    const newProjectData = {
      customerIndustry: '製造業',
      customerScale: 'large',
      customerChallenge: 'コスト削減',
      proposalContent: '生産効率化ソリューション',
      dealStage: 'proposal',
      proposalAmount: 5000000,
    };

    const successPattern = {
      patternId: 'pattern-001',
      industry: '製造業',
      scale: 'large',
      successCriteria: 'cost_reduction',
      adoptionRate: 0.78,
    };

    const result = await evaluatePatternRelevance(
      newProjectData,
      successPattern,
      mockAIRecommendationEngine
    );

    expect(result.patternRelevanceScore).toBe(0.5);
    expect(result.isDefaultScoreUsed).toBe(true);
    expect(result.recommendationApproach).toBeDefined();
    expect(result.recommendationReasoning).toBeDefined();
    expect(result.recommendationReasoning.length).toBeGreaterThan(0);
    expect(result.recommendationReasoning.length).toBeLessThanOrEqual(200);
  });
});