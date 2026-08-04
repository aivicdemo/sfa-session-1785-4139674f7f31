import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-354
  test('[error] 推奨精度検証機能 - 閾値が未指定のとき、精度検証がエラーになる', () => {
    const input = {
      recommendationPatternId: 'pattern-001',
      threshold: undefined,
    };

    expect(() => evaluatePatternRelevance(input)).toThrow(/閾値/);
  });
});