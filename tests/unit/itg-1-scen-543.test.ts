import { describe, test, expect } from '@jest/globals';
import { judgeResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-543
  test('問題対応タイミングの判定機能 - 対応時期が入力されない場合、処理が失敗する', () => {
    const problem_id = 'PRB-20240115-001';
    const problem_occurred_at = '2024-01-15T10:30:00Z';
    const response_timing = null;

    expect(() => {
      judgeResponseTiming({
        problem_id,
        problem_occurred_at,
        response_timing,
      });
    }).toThrow(/対応時期/);
  });
});