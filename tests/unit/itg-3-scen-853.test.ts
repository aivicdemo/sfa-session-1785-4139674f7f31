import { evaluateRecommendationTrustworthiness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-853
  test('信頼度スコアがNaNのとき、エラーハンドリングが発動し処理が中断される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(NaN),
      explainRecommendationReasoning: jest.fn(),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      budget: 5000000,
      timeline: 90,
      painPoints: ['cost_reduction', 'efficiency'],
    };

    const recommendationData = {
      approach: 'integrated_solution',
      confidenceFactors: ['historical_match', 'similar_patterns'],
      successPatternIds: ['SP-042', 'SP-051'],
    };

    const result = evaluateRecommendationTrustworthiness(
      dealConditions,
      recommendationData,
      mockAIRecommendationEngine,
      mockLogger
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealConditions,
      recommendationData.successPatternIds
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/信頼度スコア算出失敗.*NaN/)
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(result).toBeUndefined();
  });
});