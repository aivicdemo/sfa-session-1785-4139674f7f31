import { describe, test, expect } from '@jest/globals';
import { analyzeProcessExecutionAndContractCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1193
  test('プロセスステップ実行度が100を超える値のときエラーをスローする', () => {
    const invalid_execution_rate = 101;
    const sales_person_id = 'sp_001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      analyzeProcessExecutionAndContractCorrelation({
        sales_person_id,
        process_execution_rate: invalid_execution_rate,
        analysis_period_start,
        analysis_period_end,
      })
    ).toThrow(/PROCESS_EXECUTION_RATE_EXCEEDED/);
  });
});