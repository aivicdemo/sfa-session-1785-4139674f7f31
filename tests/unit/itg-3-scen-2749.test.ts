import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2749
  test('推奨精度スコアが基準値を超過したとき、研修実施可と判定される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.81,
        isRelevant: true,
      }),
    };

    const dealCondition = {
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealType: 'new_product_proposal',
      dealValue: 5000000,
    };

    const THRESHOLD = 0.80;

    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIRecommendationEngine.evaluatePatternRelevance
    );

    expect(result.trainingRecommended).toBe(true);
    expect(result.judgmentStatus).toBe('TRAINING_RECOMMENDED');
    expect(result.judgmentReasonLog).toContain(
      'PatternRelevanceScore: 0.81 exceeds threshold: 0.80'
    );
    expect(result.relevanceScore).toBe(0.81);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});