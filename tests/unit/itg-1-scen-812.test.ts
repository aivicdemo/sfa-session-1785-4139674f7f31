import { calculateDetectionResultSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-812
  test('[normal] 問題検出結果の重要度・根拠・対応必要性判定機能 - 検出結果1件のとき、重要度が判定され営業部長報告対象が決定される', () => {
    const detection_input = {
      detection_id: 'DET-20240115-001',
      detection_content: '売上予測と実績の乖離率が15%超過',
      deviation_rate: 15.5,
      threshold_deviation_rate: 15.0,
      detection_timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const result = calculateDetectionResultSeverity(detection_input);

    expect(result.severity_level).toBe('high');
    expect(result.report_to_executive_flag).toBe(true);
    expect(result.judgment_reason).toContain('売上予測乖離率が閾値15%を超過');
  });
});