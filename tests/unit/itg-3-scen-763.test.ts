import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-763: [edge] 推奨生成ロジック(AIエージェント正常応答) - AIRecommendationEngine.findSimilarPatterns が 1 件を返すとき、その提案アプローチが返却される', () => {
    const mockSimilarPattern = {
      patternId: 'PATTERN-001',
      matchScore: 0.92,
      successMetrics: {
        closureRate: 0.85,
        dealSize: 5000000,
      },
      proposalApproach: '顧客の既存システム統合を重視した段階的導入提案',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([mockSimilarPattern]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const testDealCondition = {
      customerIndustry: '金融',
      issue: 'システム統合',
      budget: 5000000,
    };

    const recommendationEngine = new AIRecommendationEngine(mockAIEngine);
    const result = recommendationEngine.generateRecommendation(testDealCondition);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(testDealCondition);
    expect(result.proposalApproach).toBe('顧客の既存システム統合を重視した段階的導入提案');
    expect(result.patternId).toBe('PATTERN-001');
    expect(result.matchScore).toBe(0.92);
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);
  });
});