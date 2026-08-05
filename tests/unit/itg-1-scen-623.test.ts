import { calculateSuccessPatternMatchDegree } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-623
  test('[error] 成功パターン合致度計算に必要なパラメータが欠落しているときエラーになる', () => {
    const sales_activity_record = {
      sales_person_id: 'SP001',
      activity_type: null, // 営業活動種別を意図的に省略
      contact_frequency: 5,
      deal_progress_stage: 'negotiation',
      contact_date: new Date('2024-01-15T10:00:00Z'),
    };

    const sales_result_record = {
      deal_id: 'DEAL001',
      contract_date: new Date('2024-01-20T15:00:00Z'),
      contract_amount: 500000,
      product_category: 'SaaS',
    };

    const success_pattern_data = {
      pattern_id: 'PATTERN001',
      activity_type: 'visit',
      minimum_contact_frequency: 3,
      target_deal_stage: 'negotiation',
      success_rate: 0.85,
    };

    expect(() => {
      calculateSuccessPatternMatchDegree(
        sales_activity_record,
        sales_result_record,
        success_pattern_data
      );
    }).toThrow(/営業活動種別/);
  });
});