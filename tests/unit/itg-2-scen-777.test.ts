import { analyzeCommercialActivityPattern } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 営業プロセス実行状況分析', () => {
  // SCEN-777
  test('[normal] 営業担当者が複数件の商談記録を持つ場合、行動パターンが集計される', () => {
    const sales_person_id = 'SALES_001';
    const deal_records = [
      {
        deal_id: 'DEAL_001',
        sales_person_id,
        deal_date: '2024-01-15',
        interaction_type: '初回訪問',
        contact_duration_minutes: 30,
      },
      {
        deal_id: 'DEAL_002',
        sales_person_id,
        deal_date: '2024-01-22',
        interaction_type: '提案提示',
        contact_duration_minutes: 45,
      },
      {
        deal_id: 'DEAL_003',
        sales_person_id,
        deal_date: '2024-02-05',
        interaction_type: '契約締結',
        contact_duration_minutes: 60,
      },
    ];

    const result = analyzeCommercialActivityPattern(sales_person_id, deal_records);

    expect(result.total_deal_count).toBe(3);
    expect(result.initial_visit_percentage).toBeCloseTo(33.3, 1);
    expect(result.proposal_presentation_percentage).toBeCloseTo(33.3, 1);
    expect(result.contract_conclusion_percentage).toBeCloseTo(33.3, 1);
    expect(result.total_contact_duration_minutes).toBe(135);
    expect(result.average_contact_duration_minutes).toBe(45);
  });
});