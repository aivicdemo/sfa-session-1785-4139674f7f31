import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-771: [edge] 推奨生成ロジック(AIエージェント失敗時の振る舞い)
  test('AIRecommendationEngine.explainRecommendationReasoning が失敗したとき、簡略版の根拠説明が返却される', () => {
    const failingExplainRecommendationReasoning = jest.fn()
      .mockRejectedValue(new Error('API timeout'));

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: failingExplainRecommendationReasoning,
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMasterData = [
      {
        patternId: 'PATTERN_001',
        patternName: '標準提案アプローチ',
        successRate: 85,
        applicableIndustries: ['製造業', '流通業'],
        description: '同業種での標準的な提案パターン',
      },
      {
        patternId: 'PATTERN_002',
        patternName: '高予算企業向けアプローチ',
        successRate: 78,
        applicableIndustries: ['金融業', '大規模流通'],
        description: '予算規模が大きい企業向けパターン',
      },
    ];

    const newProjectData = {
      customerIndustry: '製造業',
      budgetScale: 5000000,
      decisionMakerCount: 3,
    };

    const result = generateRecommendation(
      newProjectData,
      mockPatternMasterData,
      mockAIRecommendationEngine
    );

    expect(result.reasoningExplanation).toMatch(/標準提案アプローチ/);
    expect(result.reasoningExplanation).toMatch(/成功率85%/);
    expect(result.reasoningExplanation).toMatch(/簡略版/);
    expect(result.reasoningExplanation).not.toContain('詳細な');
    expect(result.recommendedPatternId).toBe('PATTERN_001');
    expect(result.successRate).toBe(85);
    expect(result.applicableIndustries).toContain('製造業');
  });
});