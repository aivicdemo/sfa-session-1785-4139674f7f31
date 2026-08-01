import { evaluateDetectionResultPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-604
  test('[normal] 問題検出結果の重要度・対応必要性判定機能 - 検出結果の順序が逆である場合でも判定結果の妥当性は変わらない', () => {
    const detection_pattern_a = [
      {
        issue_id: 'ISS_001',
        severity: 'HIGH',
        frequency: 5,
        impact_score: 85,
        process_deviation_type: 'approval_step_missing'
      },
      {
        issue_id: 'ISS_002',
        severity: 'MEDIUM',
        frequency: 3,
        impact_score: 60,
        process_deviation_type: 'follow_up_delay'
      },
      {
        issue_id: 'ISS_003',
        severity: 'LOW',
        frequency: 1,
        impact_score: 30,
        process_deviation_type: 'proposal_format_deviation'
      }
    ];

    const detection_pattern_b = [
      {
        issue_id: 'ISS_003',
        severity: 'LOW',
        frequency: 1,
        impact_score: 30,
        process_deviation_type: 'proposal_format_deviation'
      },
      {
        issue_id: 'ISS_002',
        severity: 'MEDIUM',
        frequency: 3,
        impact_score: 60,
        process_deviation_type: 'follow_up_delay'
      },
      {
        issue_id: 'ISS_001',
        severity: 'HIGH',
        frequency: 5,
        impact_score: 85,
        process_deviation_type: 'approval_step_missing'
      }
    ];

    const result_a = evaluateDetectionResultPriority(detection_pattern_a);
    const result_b = evaluateDetectionResultPriority(detection_pattern_b);

    expect(result_a).toEqual(result_b);
    expect(result_a.evaluations).toHaveLength(3);
    expect(result_a.evaluations[0].severity).toBe('HIGH');
    expect(result_a.evaluations[0].priority_score).toBe(85);
    expect(result_a.evaluations[0].recommended_action).toBe('営業プロセスの承認ステップを追加');
    expect(result_a.evaluations[1].severity).toBe('MEDIUM');
    expect(result_a.evaluations[1].priority_score).toBe(60);
    expect(result_a.evaluations[1].recommended_action).toBe('フォローアップ間隔の最適化を実施');
    expect(result_a.evaluations[2].severity).toBe('LOW');
    expect(result_a.evaluations[2].priority_score).toBe(30);
    expect(result_a.evaluations[2].recommended_action).toBe('提案資料フォーマットの統一化を検討');
  });
});