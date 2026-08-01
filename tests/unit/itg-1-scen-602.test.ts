import { detectAndJudgeProblemSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-602
  test('問題検出結果の重要度・対応必要性判定機能 - 検出結果の重複データが判定結果に重複して反映される', () => {
    const duplicate_problem_records = [
      {
        deal_id: 'S-001',
        detection_rule: '売上予測値が見積比50%未満',
        detection_timestamp: new Date('2024-01-15T10:00:00Z'),
        detected_value: 45,
        threshold_value: 100,
      },
      {
        deal_id: 'S-001',
        detection_rule: '売上予測値が見積比50%未満',
        detection_timestamp: new Date('2024-01-15T10:00:00Z'),
        detected_value: 45,
        threshold_value: 100,
      },
    ];

    const judgment_results = detectAndJudgeProblemSeverity(duplicate_problem_records);

    const filtered_results = judgment_results.filter(
      (result: { deal_id: string }) => result.deal_id === 'S-001'
    );

    expect(filtered_results.length).toBe(1);
    expect(filtered_results[0].severity).toBe('高');
    expect(filtered_results[0].action_required).toBe(true);
    expect(filtered_results[0].judgment_reason).toBe('売上予測値が見積比50%未満のため対応が必要');
  });
});