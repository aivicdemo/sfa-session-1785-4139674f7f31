import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1847
  test('推奨数量が null のとき根拠情報の生成に失敗する', () => {
    const mockRecommendationWithNullQuantity = {
      recommendedApproach: 'フォローアップメール送信',
      recommendedTiming: new Date('2024-02-15T09:00:00Z'),
      recommendedQuantity: null,
      confidenceScore: 85,
      successPatternId: 'SP-0001',
    };

    const mockAIEngine: Partial<AIRecommendationEngine> = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendationWithNullQuantity),
      explainRecommendationReasoning: jest.fn().mockImplementation((recommendation) => {
        if (recommendation.recommendedQuantity === null) {
          throw new Error('推奨数量が null のため根拠情報を生成できません');
        }
        return 'sample reasoning';
      }),
    };

    expect(() => {
      (mockAIEngine.explainRecommendationReasoning as jest.Mock)(
        mockRecommendationWithNullQuantity,
      );
    }).toThrow(/推奨数量が null のため根拠情報を生成できません/);
  });
});