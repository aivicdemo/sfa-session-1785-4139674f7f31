import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-477
  test('成約実績の営業担当者IDと指定営業担当者IDが一致しない場合、エラーを返す', () => {
    const contract_rep_id = 'EMP001';
    const specified_rep_id = 'EMP002';
    const actual_results = [
      {
        sales_rep_id: contract_rep_id,
        deal_id: 'DEAL001',
        contract_date: new Date('2024-01-15T09:00:00Z'),
        contract_amount: 1500000,
      },
    ];
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        sales_rep_id: specified_rep_id,
        contract_records: actual_results,
        period_start: analysis_period_start,
        period_end: analysis_period_end,
      })
    ).toThrow(/営業担当者ID/);
  });
});