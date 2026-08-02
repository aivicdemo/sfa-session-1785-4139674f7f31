import { describe, test, expect } from '@jest/globals';
import { calculateSalesProcessExecutionAnalysis } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-778: 成約実績が0件の営業担当者の成約率が0%として計算される', () => {
    const sales_rep_data = {
      sales_rep_id: 'SR-001',
      sales_rep_name: 'Sales Rep A',
      total_deals: 0,
      closed_deals: 0,
      process_adherence_score: 85,
      deviation_patterns: []
    };

    const result = calculateSalesProcessExecutionAnalysis(sales_rep_data);

    expect(result.sales_rep_id).toBe('SR-001');
    expect(result.sales_rep_name).toBe('Sales Rep A');
    expect(result.closure_rate).toBe(0);
    expect(result.total_deals).toBe(0);
    expect(result.closed_deals).toBe(0);
  });
});