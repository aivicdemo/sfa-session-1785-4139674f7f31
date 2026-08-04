import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 商談条件が空のときの処理', () => {
  // SCEN-2428
  test('商談条件が空のときスコア計算が適切に処理される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyDealConditions = {};

    const result = evaluatePatternRelevance(
      emptyDealConditions,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(result).toBeDefined();
    expect(result.score).toBeDefined();
    expect(typeof result.score).toBe('number');

    expect(result.score).toBeGreaterThanOrEqual(0.0);
    expect(result.score).toBeLessThanOrEqual(1.0);

    expect(result.score).toBe(0.5);

    expect(result.warningFlag).toBeDefined();
    expect(result.warningFlag).toBe(true);

    expect(result.message).toMatch(/商談条件が空/);
    expect(result.message).toMatch(/推奨パターンマスタ/);
    expect(result.message).toMatch(/代替スコア/);
  });
});