import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-218
  test('システムヘルスチェック判定機能 - 営業データ品質が合格基準直下のとき不合格判定が出力される', () => {
    const mock_health_check_input = {
      system_status: 'running',
      data_quality_score: 69.9,
      quality_pass_threshold: 70,
      ai_inference_accuracy: 92.5,
      inference_pass_threshold: 90,
      check_timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const result = executeSystemHealthCheck(mock_health_check_input);

    expect(result.overall_status).toBe('NG');
    expect(result.quality_judgment).toBe('不合格');
    expect(result.quality_score).toBe(69.9);
    expect(result.quality_fail_reason).toBe('営業データ品質が基準未満です');
    expect(result.check_timestamp).toEqual(new Date('2024-01-15T11:00:00Z'));
  });
});