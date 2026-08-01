import { evaluateDetectionResultSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-594
  test('問題検出結果の重要度・対応必要性判定機能 - 同じ検出結果に対して複数回判定処理を実行しても同じ結果が得られる', () => {
    const detectionResult = {
      detection_id: 'det_001',
      violation_type: '営業プロセス違反',
      detection_datetime: new Date('2024-01-15T10:30:00Z'),
      sales_person_id: 'sales_001',
      process_step: 'initial_contact',
      deviation_score: 35,
    };

    // 1回目の判定処理
    const evaluation_1 = evaluateDetectionResultSeverity(detectionResult);

    // 2回目の判定処理
    const evaluation_2 = evaluateDetectionResultSeverity(detectionResult);

    // 3回目の判定処理
    const evaluation_3 = evaluateDetectionResultSeverity(detectionResult);

    // 1回目と2回目の判定結果の比較
    expect(evaluation_2.severity_level).toBe(evaluation_1.severity_level);
    expect(evaluation_2.action_category).toBe(evaluation_1.action_category);
    expect(evaluation_2.evaluation_datetime.toISOString()).toBe(
      evaluation_1.evaluation_datetime.toISOString()
    );

    // 3回目と1回目の判定結果の比較
    expect(evaluation_3.severity_level).toBe(evaluation_1.severity_level);
    expect(evaluation_3.action_category).toBe(evaluation_1.action_category);
    expect(evaluation_3.evaluation_datetime.toISOString()).toBe(
      evaluation_1.evaluation_datetime.toISOString()
    );

    // 具体的な期待値の検証
    expect(evaluation_1.severity_level).toBe(2);
    expect(evaluation_1.action_category).toBe('改善指導必須');
    expect(evaluation_1.priority_score).toBe(65);
  });
});