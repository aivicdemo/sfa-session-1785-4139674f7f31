import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性評価機能', () => {
  // SCEN-070
  test('同じ成功パターンと商談条件で複数回評価を実行しても同じスコアが返される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    const successPattern = {
      patternId: 'SUCCESS_001',
      industryType: '製造業',
      dealAmountMin: 5000000,
      dealAmountMax: 10000000,
    };

    const dealCondition = {
      industryType: '製造業',
      dealAmount: 7500000,
      implementationPeriodMonths: 3,
    };

    const score1 = evaluatePatternRelevance(successPattern, dealCondition, mockAIEngine);
    const score2 = evaluatePatternRelevance(successPattern, dealCondition, mockAIEngine);
    const score3 = evaluatePatternRelevance(successPattern, dealCondition, mockAIEngine);

    expect(score1).toBe(0.85);
    expect(score2).toBe(0.85);
    expect(score3).toBe(0.85);
    expect(score1 === score2 && score2 === score3).toBe(true);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});