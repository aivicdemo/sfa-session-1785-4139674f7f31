import { describe, test, expect } from '@jest/globals';
import { calculateSystemHealthCheckResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-215: [normal] システムヘルスチェック判定機能 - システム稼働状況が合格基準を満たすとき合格判定が出力される
  test('should return PASS status when all metrics are within acceptable thresholds', () => {
    const input = {
      cpu_usage_percent: 65,
      memory_usage_percent: 70,
      disk_usage_percent: 75,
      api_response_time_ms: 150,
      db_connection_pool_usage_percent: 60,
      cpu_threshold_percent: 80,
      memory_threshold_percent: 85,
      disk_threshold_percent: 90,
      api_response_time_threshold_ms: 500,
      db_connection_pool_threshold_percent: 80,
    };

    const result = calculateSystemHealthCheckResult(input);

    expect(result.status).toBe('PASS');
    expect(result.details).toEqual({
      cpu_usage_percent: 65,
      cpu_threshold_percent: 80,
      cpu_status: 'PASS',
      memory_usage_percent: 70,
      memory_threshold_percent: 85,
      memory_status: 'PASS',
      disk_usage_percent: 75,
      disk_threshold_percent: 90,
      disk_status: 'PASS',
      api_response_time_ms: 150,
      api_response_time_threshold_ms: 500,
      api_response_time_status: 'PASS',
      db_connection_pool_usage_percent: 60,
      db_connection_pool_threshold_percent: 80,
      db_connection_pool_status: 'PASS',
    });
  });
});