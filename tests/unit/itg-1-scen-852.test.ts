import { judgeDetectionResultsPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-852: [edge] 問題検出結果の重要度・根拠・対応必要性判定機能 - 複数の検出結果が同一の重要度スコアを持つとき順序を保持する
  test('同一重要度スコアを持つ複数検出結果が入力順序を保持する', () => {
    const detection_result_1 = {
      detection_result_id: 'detect_001',
      detection_type: '売上予測乖離',
      importance_score: 70,
      timestamp: new Date('2024-01-15T09:00:00Z'),
      evidence: '前月比売上が15%低下',
    };

    const detection_result_2 = {
      detection_result_id: 'detect_002',
      detection_type: '営業活動記録漏れ',
      importance_score: 70,
      timestamp: new Date('2024-01-15T09:15:00Z'),
      evidence: '訪問記録が3日間未入力',
    };

    const detection_result_3 = {
      detection_result_id: 'detect_003',
      detection_type: '提案資料未送付',
      importance_score: 70,
      timestamp: new Date('2024-01-15T09:30:00Z'),
      evidence: 'フォローアップ後提案資料が送付されていない',
    };

    const detection_results = [
      detection_result_1,
      detection_result_2,
      detection_result_3,
    ];

    const judgment_results = judgeDetectionResultsPriority(detection_results);

    expect(judgment_results).toHaveLength(3);
    expect(judgment_results[0].detection_result_id).toBe('detect_001');
    expect(judgment_results[0].detection_type).toBe('売上予測乖離');
    expect(judgment_results[0].importance_score).toBe(70);

    expect(judgment_results[1].detection_result_id).toBe('detect_002');
    expect(judgment_results[1].detection_type).toBe('営業活動記録漏れ');
    expect(judgment_results[1].importance_score).toBe(70);

    expect(judgment_results[2].detection_result_id).toBe('detect_003');
    expect(judgment_results[2].detection_type).toBe('提案資料未送付');
    expect(judgment_results[2].importance_score).toBe(70);
  });
});