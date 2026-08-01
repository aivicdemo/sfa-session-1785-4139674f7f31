import { judgeDetectionResultPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-603
  test('問題検出結果の重要度・対応必要性判定機能 - 重要度が同値の複数検出結果が連続する場合すべてが同じ優先度で判定される', () => {
    // 重要度が『高』で異なる検出内容を持つ複数の検出結果を準備
    const detection_result_A = {
      detection_id: 'det_A',
      severity: 'high',
      content: 'Proposal content mismatch',
      timestamp: '2024-01-15T10:00:00Z',
    };
    const detection_result_B = {
      detection_id: 'det_B',
      severity: 'high',
      content: 'Customer response pattern anomaly',
      timestamp: '2024-01-15T10:05:00Z',
    };
    const detection_result_C = {
      detection_id: 'det_C',
      severity: 'high',
      content: 'Follow-up timing deviation',
      timestamp: '2024-01-15T10:10:00Z',
    };

    // 重要度が『中』で異なる検出内容を持つ複数の検出結果を準備
    const detection_result_D = {
      detection_id: 'det_D',
      severity: 'medium',
      content: 'Data quality score below threshold',
      timestamp: '2024-01-15T10:15:00Z',
    };
    const detection_result_E = {
      detection_id: 'det_E',
      severity: 'medium',
      content: 'Process deviation minor',
      timestamp: '2024-01-15T10:20:00Z',
    };
    const detection_result_F = {
      detection_id: 'det_F',
      severity: 'medium',
      content: 'Contact frequency below standard',
      timestamp: '2024-01-15T10:25:00Z',
    };

    // 重要度『高』の複数検出結果を判定機能に入力
    const priority_A = judgeDetectionResultPriority(detection_result_A);
    const priority_B = judgeDetectionResultPriority(detection_result_B);
    const priority_C = judgeDetectionResultPriority(detection_result_C);

    // 重要度『中』の複数検出結果を判定機能に入力
    const priority_D = judgeDetectionResultPriority(detection_result_D);
    const priority_E = judgeDetectionResultPriority(detection_result_E);
    const priority_F = judgeDetectionResultPriority(detection_result_F);

    // 重要度が『高』である検出結果A・B・Cすべての優先度が同一の値であることを確認
    expect(priority_A).toBe(1);
    expect(priority_B).toBe(1);
    expect(priority_C).toBe(1);

    // 重要度が『中』である検出結果D・E・Fすべての優先度が同一の値であることを確認
    expect(priority_D).toBe(2);
    expect(priority_E).toBe(2);
    expect(priority_F).toBe(2);

    // 重要度グループごとに優先度が統一されていることを確認
    expect(priority_A).toEqual(priority_B);
    expect(priority_B).toEqual(priority_C);
    expect(priority_D).toEqual(priority_E);
    expect(priority_E).toEqual(priority_F);

    // 重要度が異なるグループ間では優先度が異なることを確認
    expect(priority_A).not.toEqual(priority_D);
  });
});