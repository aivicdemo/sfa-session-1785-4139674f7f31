import { describe, test, expect } from '@jest/globals';
import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-238
  test('標準プロセス遵守度スコア計算機能 - 乖離度計算において時間経過の計算結果が負数になるときエラーになる', () => {
    const plannedCompletionTime = new Date('2024-01-15T14:00:00Z');
    const actualCompletionTime = new Date('2024-01-15T14:00:00Z');

    const result = calculateDeviationScore({
      plannedCompletionTime,
      actualCompletionTime,
    });

    expect(result).toEqual(
      expect.objectContaining({
        isError: true,
        errorCode: 'TIME_NEGATIVE_DEVIATION',
        message: expect.stringMatching(/時間経過の計算結果が負数です/),
      })
    );
    expect(result).toBeInstanceOf(Error);
  });
});