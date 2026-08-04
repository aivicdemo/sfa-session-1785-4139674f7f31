import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1722
  test('成功パターンID群が欠落しているとき推奨スコアを0で計算する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    const newDealCondition = {
      customerIndustry: 'IT',
      customerScale: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const successPatternIdsEmpty = [];
    const resultWithEmptyPatterns = evaluatePatternRelevance(
      newDealCondition,
      successPatternIdsEmpty,
      mockAIEngine
    );

    expect(resultWithEmptyPatterns).toBe(0);

    const successPatternIdsNull = null;
    const resultWithNullPatterns = evaluatePatternRelevance(
      newDealCondition,
      successPatternIdsNull,
      mockAIEngine
    );

    expect(resultWithNullPatterns).toBe(0);
  });
});