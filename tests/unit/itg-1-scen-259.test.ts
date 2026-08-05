import { analyzeActionPatternsAndDetermineCoachingPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-259: [normal] 行動パターン分析と改善指導優先順位判定機能 - 営業担当者複数名の商談進捗、提案内容、顧客接触頻度から各々の乖離度が計算され、成約実績との相関に基づいて複数の改善指導対象者と指導内容が判定される
  test('複数の営業担当者の行動パターン分析から改善指導優先順位を正しく判定する', () => {
    const sales_rep_data = [
      {
        sales_rep_id: 'rep_a',
        sales_rep_name: 'Sales Rep A',
        deal_progress_rate: 80,
        proposal_count: 5,
        customer_contact_frequency_per_week: 2,
        contract_amount_yen: 800000,
      },
      {
        sales_rep_id: 'rep_b',
        sales_rep_name: 'Sales Rep B',
        deal_progress_rate: 50,
        proposal_count: 2,
        customer_contact_frequency_per_week: 0.25,
        contract_amount_yen: 300000,
      },
      {
        sales_rep_id: 'rep_c',
        sales_rep_name: 'Sales Rep C',
        deal_progress_rate: 70,
        proposal_count: 4,
        customer_contact_frequency_per_week: 1,
        contract_amount_yen: 600000,
      },
    ];

    const standard_process_definition = {
      target_deal_progress_rate: 80,
      target_proposal_count_per_month: 4,
      target_contact_frequency_per_week: 2,
    };

    const result = analyzeActionPatternsAndDetermineCoachingPriority(
      sales_rep_data,
      standard_process_definition
    );

    // 結果構造の検証
    expect(result).toHaveProperty('coaching_targets');
    expect(Array.isArray(result.coaching_targets)).toBe(true);
    expect(result.coaching_targets.length).toBe(2);

    // 最優先対象者：Rep B（乖離度が最も高い）
    const primary_target = result.coaching_targets[0];
    expect(primary_target.sales_rep_id).toBe('rep_b');
    expect(primary_target.sales_rep_name).toBe('Sales Rep B');
    expect(primary_target.priority_rank).toBe(1);

    // Rep B の乖離度計算：
    // deal_progress_rate deviation: (50 - 80) / 80 = -0.375 (37.5% 低い)
    // proposal_count deviation: (2 - 4) / 4 = -0.5 (50% 低い)
    // contact_frequency deviation: (0.25 - 2) / 2 = -0.875 (87.5% 低い)
    // 総合乖離度: (37.5 + 50 + 87.5) / 3 = 58.33%
    expect(primary_target.deviation_score).toBeCloseTo(58.33, 1);

    // Rep B の指導内容（2項目）
    expect(primary_target.coaching_actions).toHaveLength(2);
    const coaching_actions_set = new Set(
      primary_target.coaching_actions.map((action: any) => action.action_type)
    );
    expect(coaching_actions_set.has('increase_contact_frequency')).toBe(true);
    expect(coaching_actions_set.has('increase_proposal_count')).toBe(true);

    // 接触頻度増加の指導内容確認
    const contact_freq_action = primary_target.coaching_actions.find(
      (action: any) => action.action_type === 'increase_contact_frequency'
    );
    expect(contact_freq_action).toBeDefined();
    expect(contact_freq_action.target_value).toBe(2);
    expect(contact_freq_action.current_value).toBe(0.25);
    expect(contact_freq_action.description).toMatch(/接触頻度/);

    // 提案回数増加の指導内容確認
    const proposal_action = primary_target.coaching_actions.find(
      (action: any) => action.action_type === 'increase_proposal_count'
    );
    expect(proposal_action).toBeDefined();
    expect(proposal_action.target_value).toBe(4);
    expect(proposal_action.current_value).toBe(2);
    expect(proposal_action.description).toMatch(/提案回数/);

    // 次優先対象者：Rep C（乖離度中程度）
    const secondary_target = result.coaching_targets[1];
    expect(secondary_target.sales_rep_id).toBe('rep_c');
    expect(secondary_target.sales_rep_name).toBe('Sales Rep C');
    expect(secondary_target.priority_rank).toBe(2);

    // Rep C の乖離度計算：
    // deal_progress_rate deviation: (70 - 80) / 80 = -0.125 (12.5% 低い)
    // proposal_count deviation: (4 - 4) / 4 = 0 (0%)
    // contact_frequency deviation: (1 - 2) / 2 = -0.5 (50% 低い)
    // 総合乖離度: (12.5 + 0 + 50) / 3 = 20.83%
    expect(secondary_target.deviation_score).toBeCloseTo(20.83, 1);

    // Rep C の指導内容（1項目：商談進捗率向上）
    expect(secondary_target.coaching_actions).toHaveLength(1);
    expect(secondary_target.coaching_actions[0].action_type).toBe(
      'improve_deal_progress_rate'
    );
    expect(secondary_target.coaching_actions[0].target_value).toBe(80);
    expect(secondary_target.coaching_actions[0].current_value).toBe(70);
    expect(secondary_target.coaching_actions[0].description).toMatch(/商談進捗率/);

    // Rep A は改善指導対象外（乖離度が小さい）
    const target_ids = result.coaching_targets.map((t: any) => t.sales_rep_id);
    expect(target_ids.includes('rep_a')).toBe(false);

    // 成約実績との相関分析結果が含まれていることを確認
    expect(result).toHaveProperty('correlation_analysis');
    expect(result.correlation_analysis).toHaveProperty('correlation_coefficient');
    expect(typeof result.correlation_analysis.correlation_coefficient).toBe('number');
    // 乖離度が低いほど成約実績が高い負の相関が期待される
    expect(result.correlation_analysis.correlation_coefficient).toBeLessThan(0);

    // 相関分析の詳細内容
    expect(result.correlation_analysis).toHaveProperty('total_samples');
    expect(result.correlation_analysis.total_samples).toBe(3);
    expect(result.correlation_analysis).toHaveProperty('analysis_date');
    expect(typeof result.correlation_analysis.analysis_date).toBe('string');
  });
});