import { extractSuccessPatternWeights } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2826
  test('成功パターン特徴量が逆順で入力されるとき、抽出された重み付けルールが正順入力と同一結果になる', () => {
    const mockAIEngine = {
      extractPatternWeights: jest.fn((patterns: any[]) => ({
        patternWeights: { A: 0.5, B: 0.3, C: 0.2 },
        ruleSet: ['rule_1', 'rule_2', 'rule_3'],
      })),
    };

    const successOrderPatterns = [
      { id: 1, feature: 'A', timestamp: new Date('2024-01-01T00:00:00Z') },
      { id: 2, feature: 'B', timestamp: new Date('2024-01-02T00:00:00Z') },
      { id: 3, feature: 'C', timestamp: new Date('2024-01-03T00:00:00Z') },
    ];

    const successOrderResult = extractSuccessPatternWeights(
      successOrderPatterns,
      mockAIEngine
    );

    const reverseOrderPatterns = [
      { id: 3, feature: 'C', timestamp: new Date('2024-01-03T00:00:00Z') },
      { id: 2, feature: 'B', timestamp: new Date('2024-01-02T00:00:00Z') },
      { id: 1, feature: 'A', timestamp: new Date('2024-01-01T00:00:00Z') },
    ];

    const reverseOrderResult = extractSuccessPatternWeights(
      reverseOrderPatterns,
      mockAIEngine
    );

    expect(reverseOrderResult.patternWeights).toEqual(
      successOrderResult.patternWeights
    );
    expect(reverseOrderResult.ruleSet).toEqual(successOrderResult.ruleSet);
    expect(reverseOrderResult.patternWeights).toEqual({
      A: 0.5,
      B: 0.3,
      C: 0.2,
    });
    expect(reverseOrderResult.ruleSet).toEqual(['rule_1', 'rule_2', 'rule_3']);
  });
});