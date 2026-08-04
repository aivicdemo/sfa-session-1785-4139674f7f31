import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出', () => {
  test('SCEN-490: 重要度スコアが0から100の範囲外のとき、エラーが発生する', () => {
    // ステップ2: 重要度スコア = -1 のとき、エラーが発生する
    expect(() => calculateImprovementPriorityRank({ importanceScore: -1 })).toThrow(/重要度スコア/);

    // ステップ3: 重要度スコア = 101 のとき、エラーが発生する
    expect(() => calculateImprovementPriorityRank({ importanceScore: 101 })).toThrow(/重要度スコア/);

    // ステップ4: 重要度スコア = 0 のとき（境界値・有効値）、エラーが発生しない
    const resultAtZero = calculateImprovementPriorityRank({ importanceScore: 0 });
    expect(resultAtZero).toBeDefined();
    expect(typeof resultAtZero.rank).toBe('string');

    // ステップ5: 重要度スコア = 100 のとき（境界値・有効値）、エラーが発生しない
    const resultAtHundred = calculateImprovementPriorityRank({ importanceScore: 100 });
    expect(resultAtHundred).toBeDefined();
    expect(typeof resultAtHundred.rank).toBe('string');
  });
});