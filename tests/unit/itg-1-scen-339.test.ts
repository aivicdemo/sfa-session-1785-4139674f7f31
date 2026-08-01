import { generateSalesActivityReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-339
  test('[edge] 期間の開始日が月初、終了日が月末の場合、1ヶ月全体のデータが正常に集計される', () => {
    const sales_rep_id = 'SA001';
    const start_date = '2024-01-01';
    const end_date = '2024-01-31';

    const mock_activities = {
      visit_count: 15,
      proposal_count: 8,
      contract_count: 3,
      avg_meeting_duration_minutes: 45,
      email_count: 120,
      monthly_contract_amount: 2400000,
    };

    const result = generateSalesActivityReport({
      sales_rep_id: sales_rep_id,
      start_date: start_date,
      end_date: end_date,
      activities: mock_activities,
    });

    expect(result.period_start).toBe('2024-01-01');
    expect(result.period_end).toBe('2024-01-31');
    expect(result.active_days).toBe(31);
    expect(result.total_visit_count).toBe(15);
    expect(result.total_proposal_count).toBe(8);
    expect(result.total_contract_count).toBe(3);
    expect(result.contract_rate).toBe(37.5);
    expect(result.avg_meeting_duration_minutes).toBe(45);
    expect(result.total_email_count).toBe(120);
    expect(result.monthly_contract_amount).toBe(2400000);
  });
});