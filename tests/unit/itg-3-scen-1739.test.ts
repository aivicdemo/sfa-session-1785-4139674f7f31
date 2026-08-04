import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能 - 決定論性検証', () => {
  // SCEN-1739
  test('同じ入力で2回実行したとき推奨スコアが同じ値になる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(() => 0.85),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      budgetAmount: '5000万円',
      dealStage: '提案段階',
    };

    const scoreFirst = evaluatePatternRelevance(
      dealCondition,
      mockAIRecommendationEngine
    );

    const scoreSecond = evaluatePatternRelevance(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(scoreFirst).toBeCloseTo(scoreSecond, 6);
    expect(scoreFirst).toBeCloseTo(0.85, 6);
    expect(scoreSecond).toBeCloseTo(0.85, 6);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});