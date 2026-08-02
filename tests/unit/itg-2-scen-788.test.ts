import { analyzeSalesProcessExecutionStatus } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  // SCEN-788
  test('商談記録に重複データが含まれている場合、集計から重複が除外される', () => {
    const duplicate_deal_record_1 = {
      deal_id: 'DEAL-001',
      sales_rep_name: '田中太郎',
      customer_name: 'ABC商事',
      amount: 500000,
      status: '完了',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const duplicate_deal_record_2 = {
      deal_id: 'DEAL-001',
      sales_rep_name: '田中太郎',
      customer_name: 'ABC商事',
      amount: 500000,
      status: '完了',
      created_at: new Date('2024-01-15T10:05:00Z'),
    };

    const deal_records = [duplicate_deal_record_1, duplicate_deal_record_2];

    const analysis_result = analyzeSalesProcessExecutionStatus(deal_records);

    expect(analysis_result.total_deal_count).toBe(1);
    expect(analysis_result.total_sales_amount).toBe(500000);
    expect(analysis_result.completed_deal_count).toBe(1);
  });
});