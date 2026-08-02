import { extractSuccessPatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  test('SCEN-831: 営業担当者の複数件の商談実績データから成功パターンが抽出される', () => {
    const sales_person_id = 'SP001';
    const deal_records = [
      {
        deal_id: 'DEAL001',
        sales_person_id: sales_person_id,
        customer_name: '顧客A',
        contact_frequency: 5,
        deal_duration_days: 30,
        proposal_category: 'ソリューション提案',
        outcome: 'success',
        contract_amount: 1000000,
      },
      {
        deal_id: 'DEAL002',
        sales_person_id: sales_person_id,
        customer_name: '顧客B',
        contact_frequency: 2,
        deal_duration_days: 15,
        proposal_category: 'プロダクト提案',
        outcome: 'failure',
        contract_amount: 0,
      },
      {
        deal_id: 'DEAL003',
        sales_person_id: sales_person_id,
        customer_name: '顧客C',
        contact_frequency: 4,
        deal_duration_days: 25,
        proposal_category: 'ソリューション提案',
        outcome: 'success',
        contract_amount: 1500000,
      },
      {
        deal_id: 'DEAL004',
        sales_person_id: sales_person_id,
        customer_name: '顧客D',
        contact_frequency: 1,
        deal_duration_days: 10,
        proposal_category: 'プロダクト提案',
        outcome: 'failure',
        contract_amount: 0,
      },
    ];

    const result = extractSuccessPatterns({
      sales_person_id: sales_person_id,
      deal_records: deal_records,
    });

    expect(result.total_deals_analyzed).toBe(4);
    expect(result.success_deals_count).toBe(2);
    expect(result.success_patterns).toBeDefined();
    expect(Array.isArray(result.success_patterns)).toBe(true);
    expect(result.success_patterns.length).toBeGreaterThan(0);

    const success_pattern = result.success_patterns[0];
    expect(success_pattern.pattern_id).toBeDefined();
    expect(success_pattern.avg_contact_frequency).toBe(4.5);
    expect(success_pattern.avg_deal_duration_days).toBe(27.5);
    expect(success_pattern.proposal_category).toBe('ソリューション提案');
    expect(success_pattern.success_rate).toBe(0.5);
    expect(success_pattern.supporting_deal_ids).toEqual(['DEAL001', 'DEAL003']);
  });
});