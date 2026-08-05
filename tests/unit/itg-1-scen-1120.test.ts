import { describe, it, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1120
  it('成約率計算の分母がnullのとき、エラーがスロー（throw）されること', () => {
    const input = {
      sales_rep_id: 'SR001',
      sales_rep_name: '田中太郎',
      reporting_period: '2024-01',
      contract_count: 5,
      total_activity_count: null,
      proposal_success_rate: 0.6,
      follow_up_interval_days: 3.5,
      standard_process_deviation_score: 0.15,
      actual_revenue: 1500000,
    };

    expect(() => generateSalesActivityPatternReport(input)).toThrow(/営業活動総件数/);
  });
});