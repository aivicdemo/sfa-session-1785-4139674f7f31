import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeDeviationAndJudgeImprovement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      improvement_guidance_results: [] as any[],
    };
  });

  afterEach(() => {
    mockDb = null;
  });

  // SCEN-273
  test('標準プロセスとの乖離度が null のとき、処理が中断されエラーが返される', () => {
    const sales_staff_id = 'STAFF_001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');
    const standard_process_definition = {
      process_id: 'PROC_001',
      stage_name: 'initial_contact',
      expected_duration_days: 3,
    };
    const deviation_rate = null;
    const actual_behavior_pattern = {
      contact_frequency_days: 5,
      proposal_count: 2,
      followup_interval_days: 7,
    };
    const contract_results_sample = {
      successful_contract_count: 1,
      total_proposal_count: 3,
      contract_rate: 0.333,
    };

    const input_params = {
      sales_staff_id,
      analysis_period_start,
      analysis_period_end,
      standard_process_definition,
      deviation_rate,
      actual_behavior_pattern,
      contract_results_sample,
    };

    expect(() => analyzeDeviationAndJudgeImprovement(input_params)).toThrow(
      /乖離度/
    );
  });
});