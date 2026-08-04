import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1934
  test('推奨内容の根拠表示機能 - 根拠データのパターンIDが欠落しているときに表示処理がスキップされる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'システム導入プロジェクトの段階的実装',
        reasoningBasis: [
          {
            patternId: undefined,
            customerSegment: 'IT業界',
            budgetRange: 5000000,
            challengeType: 'システム導入',
            successRate: 0.82,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const spyExplainReasoning = jest.spyOn(
      mockAIRecommendationEngine,
      'explainRecommendationReasoning'
    );

    const inputConditions = {
      industry: 'IT',
      budget: 5000000,
      challenge: 'システム導入',
    };

    const result = explainRecommendationReasoning(
      mockAIRecommendationEngine.generateRecommendation,
      mockAIRecommendationEngine.explainRecommendationReasoning,
      inputConditions
    );

    expect(spyExplainReasoning).not.toHaveBeenCalled();
    expect(result).toEqual({
      recommendedApproach: 'システム導入プロジェクトの段階的実装',
      reasoningExplanation: null,
      displayStatus: 'skipped',
    });
  });
});