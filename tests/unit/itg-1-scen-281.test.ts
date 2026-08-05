import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('営業担当者行動パターン分析・改善指導判定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-281
  test('[error] 標準プロセス定義が null のとき、乖離度計算ができず処理が中断される', () => {
    const salesperson_id = 'SP001';
    const actual_behavior_pattern = {
      initial_contact_frequency: 2,
      proposal_count: 1,
      followup_interval_days: 14,
      customer_response_rate: 0.65,
    };
    const standard_process_definition = null;
    const conversion_results = [
      {
        opportunity_id: 'OPP001',
        customer_id: 'CUST001',
        closed_won: true,
        amount: 500000,
      },
    ];

    expect(() =>
      calculateDeviationScore(
        salesperson_id,
        actual_behavior_pattern,
        standard_process_definition,
        conversion_results
      )
    ).toThrow(/標準プロセス定義/);
  });
});