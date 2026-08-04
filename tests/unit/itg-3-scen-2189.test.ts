import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2189: 複数の成功パターンが抽出されたとき最も高いマッチスコアを持つパターンが選出される - 成功パターンが1件のみのとき、その1件が優先順位1位で返される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          matchScore: 0.92,
          patternId: 'PAT-001',
          patternName: '大型案件向け複数担当者アプローチ',
          successRate: 0.87,
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      industry: 'IT',
      dealSize: '大型',
      decisionMakerCount: 3,
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].priority).toBe(1);
    expect(result.recommendations[0].patternId).toBe('PAT-001');
    expect(result.recommendations[0].matchScore).toBe(0.92);
    expect(result.recommendations[0].status).toBe('primary');
  });
});