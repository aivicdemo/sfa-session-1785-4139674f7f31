import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateMonthlyProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-250: [edge] 標準プロセス遵守度スコア計算機能 - 営業担当者の商談記録が月末日に入力されたとき正しく集計される
  test('should correctly aggregate sales rep process compliance score when deal record is input on last day of month', () => {
    const targetMonth = 12;
    const targetYear = 2024;
    const monthEndDate = new Date('2024-12-31T23:59:59Z');
    const salesRepId = 'EMP001';
    const dealAmount = 5000000; // 500万円
    const processStep = '提案完了';

    const dealRecord = {
      sales_rep_id: salesRepId,
      recorded_at: monthEndDate.toISOString(),
      deal_amount: dealAmount,
      process_step: processStep,
      deal_count: 1,
    };

    const result = calculateMonthlyProcessComplianceScore({
      sales_rep_id: salesRepId,
      target_month: targetMonth,
      target_year: targetYear,
      deal_records: [dealRecord],
    });

    expect(result.monthly_aggregation_count).toBe(1);
    expect(result.monthly_aggregation_amount).toBe(5000000);
    expect(result.aggregation_log).toMatch(/12月度集計対象：1件、金額：5000000/);
    expect(result.is_included_in_monthly_calculation).toBe(true);
    expect(result.sales_rep_id).toBe('EMP001');
    expect(result.target_month).toBe(12);
    expect(result.target_year).toBe(2024);
  });
});