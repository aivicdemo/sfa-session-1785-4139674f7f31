import { describe, test, expect } from '@jest/globals';
import { analyzeProcessStepCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1192
  test('プロセスステップ実行度が負の値のとき入力値検証エラーをスロー', () => {
    const input_process_step_rate = -10;
    const input_contract_achievement = 0.75;
    const input_analysis_period_days = 30;

    expect(() =>
      analyzeProcessStepCorrelation({
        process_step_rate: input_process_step_rate,
        contract_achievement: input_contract_achievement,
        analysis_period_days: input_analysis_period_days,
      })
    ).toThrow(/プロセスステップ実行度/);
  });
});