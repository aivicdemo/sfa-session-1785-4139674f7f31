import { evaluateRecommendationReliability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化機能', () => {
  // SCEN-823
  test('顧客購買シグナルデータが空配列のときエラーで処理が進まない', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      recommendationContent: {
        proposalApproach: 'フォローアップ提案',
        timingJudgment: '3週間後',
        proposedQuantity: 100,
      },
      customerPurchaseSignals: [],
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    expect(() => {
      evaluateRecommendationReliability(input);
    }).toThrow(/購買シグナル/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});