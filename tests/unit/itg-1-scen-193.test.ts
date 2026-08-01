import { calculateCoachingPriority } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析・改善指導対象判定機能', () => {
  // SCEN-193
  test('改善指導の優先順位が中位の場合、計画的実施対象として管理職に提示される', () => {
    const sales_rep_id = 'REP001';
    const sales_rep_name = '田中太郎';
    const department = '東京営業部';
    const sales_target_achievement_rate = 75;
    const customer_visit_frequency_per_month = 4;
    const proposal_document_creation_rate = 60;

    const result = calculateCoachingPriority({
      sales_rep_id,
      sales_rep_name,
      department,
      sales_target_achievement_rate,
      customer_visit_frequency_per_month,
      proposal_document_creation_rate,
    });

    expect(result.coaching_priority_score).toBe(50);
    expect(result.coaching_priority_level).toBe('中位');
    expect(result.is_planned_action_target).toBe(true);
    expect(result.coaching_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item: '顧客訪問頻度向上',
        }),
      ])
    );
    expect(result.display_status).toBe('表示対象');
  });
});