import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-332: 乖離度が正の値となる場合、改善指導の優先順位が適切に計算される', () => {
    // 乖離度が+50のデータ
    const deviationPositive50 = {
      targetValue: 100,
      actualValue: 150,
      deviation: 50
    };

    const priorityScorePositive50 = calculatePriorityScore(deviationPositive50);
    expect(priorityScorePositive50).toBeGreaterThanOrEqual(80);

    // 複数の正の乖離度データで順序性を検証
    const deviationPositive30 = {
      targetValue: 100,
      actualValue: 130,
      deviation: 30
    };

    const deviationPositive70 = {
      targetValue: 100,
      actualValue: 170,
      deviation: 70
    };

    const priorityScorePositive30 = calculatePriorityScore(deviationPositive30);
    const priorityScorePositive70 = calculatePriorityScore(deviationPositive70);

    // 乖離度が大きいほど優先順位スコアが高くなることを検証
    expect(priorityScorePositive70).toBeGreaterThan(priorityScorePositive50);
    expect(priorityScorePositive50).toBeGreaterThan(priorityScorePositive30);
  });
});