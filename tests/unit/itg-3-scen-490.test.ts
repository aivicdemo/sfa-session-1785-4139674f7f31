import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出機能', () => {
  // SCEN-490: [error] 改善優先度ランク算出機能 - 重要度スコアが 0 から 100 の範囲外のとき、エラーが発生する
  test('should throw error when importance_score is less than 0', () => {
    const input_params = {
      importance_score: -1,
    };
    expect(() => calculateImprovementPriorityRank(input_params)).toThrow(/重要度スコア/);
  });

  test('should throw error when importance_score is greater than 100', () => {
    const input_params = {
      importance_score: 101,
    };
    expect(() => calculateImprovementPriorityRank(input_params)).toThrow(/重要度スコア/);
  });

  test('should succeed when importance_score is 0 (valid boundary)', () => {
    const input_params = {
      importance_score: 0,
    };
    const result = calculateImprovementPriorityRank(input_params);
    expect(result).toBeDefined();
    expect(typeof result.priority_rank).toBe('string');
  });

  test('should succeed when importance_score is 100 (valid boundary)', () => {
    const input_params = {
      importance_score: 100,
    };
    const result = calculateImprovementPriorityRank(input_params);
    expect(result).toBeDefined();
    expect(typeof result.priority_rank).toBe('string');
  });
});