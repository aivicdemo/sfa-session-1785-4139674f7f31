import { calculateImprovementPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-336: 複数の改善指導対象者がいる場合、優先順位に基づいて昇順に並び替えられる', () => {
    const improvement_targets = [
      {
        target_id: 'TGT001',
        sales_person_id: 'SP001',
        priority_score: 85,
        deviation_pattern: 'missing_proposal_date',
        guidance_content: '提案日時の記録漏れ',
      },
      {
        target_id: 'TGT002',
        sales_person_id: 'SP002',
        priority_score: 60,
        deviation_pattern: 'low_contact_frequency',
        guidance_content: '顧客接触頻度が低い',
      },
      {
        target_id: 'TGT003',
        sales_person_id: 'SP003',
        priority_score: 92,
        deviation_pattern: 'delayed_closing',
        guidance_content: 'クロージングが遅延',
      },
      {
        target_id: 'TGT004',
        sales_person_id: 'SP004',
        priority_score: 75,
        deviation_pattern: 'missing_proposal_content',
        guidance_content: '提案内容の記録不足',
      },
    ];

    const sorted_result = calculateImprovementPriority(improvement_targets);

    expect(sorted_result).toHaveLength(4);
    expect(sorted_result[0].priority_score).toBe(60);
    expect(sorted_result[0].target_id).toBe('TGT002');
    expect(sorted_result[1].priority_score).toBe(75);
    expect(sorted_result[1].target_id).toBe('TGT004');
    expect(sorted_result[2].priority_score).toBe(85);
    expect(sorted_result[2].target_id).toBe('TGT001');
    expect(sorted_result[3].priority_score).toBe(92);
    expect(sorted_result[3].target_id).toBe('TGT003');
  });
});