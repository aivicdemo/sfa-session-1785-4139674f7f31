import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-142
  test('商談記録が複数件のとき、全件に対する標準プロセス遵守度スコアが正常に計算される', () => {
    const sales_rep_id = 'EMP001';
    const deal_records = [
      {
        deal_id: 'DEAL001',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST001',
        initial_contact_completed: true,
        needs_analysis_completed: true,
        proposal_completed: true,
        closing_completed: false,
        recorded_at: '2024-01-10T09:00:00Z'
      },
      {
        deal_id: 'DEAL002',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST002',
        initial_contact_completed: true,
        needs_analysis_completed: true,
        proposal_completed: true,
        closing_completed: true,
        recorded_at: '2024-01-15T14:30:00Z'
      },
      {
        deal_id: 'DEAL003',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST003',
        initial_contact_completed: true,
        needs_analysis_completed: true,
        proposal_completed: false,
        closing_completed: false,
        recorded_at: '2024-01-20T11:00:00Z'
      }
    ];

    const result = generateSalesPatternAnalysisReport({
      sales_rep_id: sales_rep_id,
      deal_records: deal_records
    });

    expect(result.standard_process_compliance_score).toBe(75.0);
  });
});