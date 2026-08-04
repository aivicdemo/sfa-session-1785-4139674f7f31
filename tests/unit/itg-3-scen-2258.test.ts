import { analyzeAnomalousPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2258
  test('提案内容が空のとき、異常パターン検出処理がエラーをスローする', () => {
    const proposalContent = '';
    const customerResponsePattern = 'follow_up_delay';
    const standardProcessBaseline = {
      recommendedApproach: 'direct_contact',
      expectedResponseTime: 24,
      successRate: 0.75,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      analyzeAnomalousPatterns(
        proposalContent,
        customerResponsePattern,
        standardProcessBaseline,
        mockAIEngine,
      ),
    ).toThrow(/提案内容/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});