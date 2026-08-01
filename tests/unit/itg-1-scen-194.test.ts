import { analyzeSalesPersonBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-194
  test('改善指導の優先順位が最低位の場合、参考情報として管理職に提示される', () => {
    const input = {
      sales_person_id: 'SP001',
      sales_person_name: '営業担当者A',
      department: '営業部',
      current_contract_rate: 45,
      improvement_instruction_priority_score: 1,
      max_priority_score: 5,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
      behavior_pattern_data: {
        initial_contact_frequency: 2.5,
        proposal_success_rate: 35,
        followup_interval_days: 8,
        standard_process_compliance_deviation: 22,
      },
    };

    const result = analyzeSalesPersonBehaviorPattern(input);

    expect(result.is_reference_information).toBe(true);
    expect(result.improvement_instruction_priority_rank).toBe('最低位');
    expect(result.display_text).toBe(
      '【参考情報】営業担当者A（営業部）成約率: 45% 改善指導優先度: 最低位'
    );
    expect(result.sales_person_name).toBe('営業担当者A');
    expect(result.department).toBe('営業部');
    expect(result.current_contract_rate).toBe(45);
    expect(result.improvement_instruction_priority_score).toBe(1);
  });
});