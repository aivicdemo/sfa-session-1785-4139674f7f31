import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析レポート生成機能', () => {
  // SCEN-544
  test('成約実績データが欠落している場合、エラーになる', () => {
    const sales_rep_id = 'EMP001';
    const activity_records = [
      {
        activity_id: 'ACT001',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST001',
        activity_type: 'visit',
        activity_date: new Date('2024-01-15T09:00:00Z'),
        duration_minutes: 60,
      },
      {
        activity_id: 'ACT002',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST001',
        activity_type: 'call',
        activity_date: new Date('2024-01-20T14:30:00Z'),
        duration_minutes: 20,
      },
      {
        activity_id: 'ACT003',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST002',
        activity_type: 'email',
        activity_date: new Date('2024-01-25T10:15:00Z'),
        duration_minutes: 15,
      },
    ];
    const deal_records = undefined;

    expect(() =>
      generateSalesActivityAnalysisReport({
        sales_rep_id,
        activity_records,
        deal_records,
      }),
    ).toThrow(/成約実績データが見つかりません|Deal data is required/);
  });
});