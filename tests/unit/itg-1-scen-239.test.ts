import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-239: [normal] システムヘルスチェック判定機能 - 同じ入力で2回実行しても同じレポート結果が出力される', () => {
    // Arrange: 同一入力パラメータを定義
    const health_check_input = {
      cpu_usage_percent: 75,
      memory_usage_percent: 82,
      disk_usage_percent: 90,
      api_response_time_ms: 250,
      db_connection_current: 45,
      db_connection_max: 50,
    };

    // Act: 1回目の実行
    const report_1 = executeSystemHealthCheck(health_check_input);

    // Act: 2回目の実行（同一パラメータ）
    const report_2 = executeSystemHealthCheck(health_check_input);

    // Assert: 全フィールドの一致確認（タイムスタンプ除外）
    expect(report_1.health_status).toBe(report_2.health_status);
    expect(report_1.health_status).toBe('WARNING');

    expect(report_1.cpu_evaluation).toBe(report_2.cpu_evaluation);
    expect(report_1.cpu_evaluation).toBe('CAUTION');

    expect(report_1.memory_evaluation).toBe(report_2.memory_evaluation);
    expect(report_1.memory_evaluation).toBe('CAUTION');

    expect(report_1.disk_evaluation).toBe(report_2.disk_evaluation);
    expect(report_1.disk_evaluation).toBe('WARNING');

    expect(report_1.api_response_evaluation).toBe(report_2.api_response_evaluation);
    expect(report_1.api_response_evaluation).toBe('NORMAL');

    expect(report_1.db_connection_evaluation).toBe(report_2.db_connection_evaluation);
    expect(report_1.db_connection_evaluation).toBe('NORMAL');

    expect(report_1.recommended_action).toBe(report_2.recommended_action);
    expect(typeof report_1.recommended_action).toBe('string');
    expect(report_1.recommended_action.length).toBeGreaterThan(0);

    // Assert: その他全フィールドの一致
    expect(report_1.cpu_usage_percent).toBe(report_2.cpu_usage_percent);
    expect(report_1.cpu_usage_percent).toBe(75);

    expect(report_1.memory_usage_percent).toBe(report_2.memory_usage_percent);
    expect(report_1.memory_usage_percent).toBe(82);

    expect(report_1.disk_usage_percent).toBe(report_2.disk_usage_percent);
    expect(report_1.disk_usage_percent).toBe(90);

    expect(report_1.api_response_time_ms).toBe(report_2.api_response_time_ms);
    expect(report_1.api_response_time_ms).toBe(250);

    expect(report_1.db_connection_current).toBe(report_2.db_connection_current);
    expect(report_1.db_connection_current).toBe(45);

    expect(report_1.db_connection_max).toBe(report_2.db_connection_max);
    expect(report_1.db_connection_max).toBe(50);
  });
});