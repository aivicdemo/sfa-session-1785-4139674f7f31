import { healthCheckWithCompositeDiagnosis } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-235
  test('システムヘルスチェック判定機能 - システム稼働状況が正常で営業データ品質が不正常なとき複合結果がレポートに出力される', () => {
    const system_health_input = {
      cpu_usage_percent: 45,
      memory_usage_percent: 60,
      disk_free_gb: 50,
      response_time_ms: 200,
    };

    const data_quality_input = {
      missing_rate_percent: 15,
      duplicate_rate_percent: 8,
      schema_violation_count: 120,
      timestamp_anomaly_count: 45,
    };

    const result = healthCheckWithCompositeDiagnosis(
      system_health_input,
      data_quality_input
    );

    expect(result.system_status).toBe('OK');

    expect(result.data_quality_status).toBe('NG');
    expect(result.data_quality_details).toEqual({
      missing_rate_percent: 15,
      duplicate_rate_percent: 8,
      schema_violation_count: 120,
      timestamp_anomaly_count: 45,
    });

    expect(result.composite_health_judgment).toBe('部分的に正常');

    expect(result.warning_message).toContain('営業データ品質の改善が必要');
  });
});