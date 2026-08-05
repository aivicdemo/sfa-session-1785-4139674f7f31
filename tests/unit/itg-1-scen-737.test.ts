import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-737
  test('[normal] AIエージェント推論精度評価機能 - 問題検出結果が複数件の状態での推論精度が適切に算出される', () => {
    // 手順1: 問題検出結果データセットを準備
    const detection_results = [
      {
        detection_id: 'det_001',
        is_correct: true,
        confidence_score: 0.95,
        detected_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        detection_id: 'det_002',
        is_correct: true,
        confidence_score: 0.88,
        detected_at: new Date('2024-01-15T10:15:00Z'),
      },
      {
        detection_id: 'det_003',
        is_correct: true,
        confidence_score: 0.92,
        detected_at: new Date('2024-01-15T10:30:00Z'),
      },
      {
        detection_id: 'det_004',
        is_correct: false,
        confidence_score: 0.71,
        detected_at: new Date('2024-01-15T10:45:00Z'),
      },
      {
        detection_id: 'det_005',
        is_correct: false,
        confidence_score: 0.65,
        detected_at: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    // 手順2: 推論精度算出関数を呼び出し
    // 正答件数: 3件, 全検出件数: 5件
    // 期待される精度: (3 / 5) * 100 = 60.0%
    const accuracy = calculateInferenceAccuracy(detection_results);

    // 手順3: 推論精度の値をアサーションで検証
    expect(accuracy).toBe(60.0);
    expect(typeof accuracy).toBe('number');
  });
});