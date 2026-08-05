import { describe, it, expect, beforeEach } from '@jest/globals';
import { executeHealthCheck } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  it('SCEN-305: [normal] システムヘルスチェック判定機能 - システム稼働状況が合格基準内であることが判定される', () => {
    // 稼働状況をスタブで設定
    const system_metrics = {
      cpu_usage_percent: 65,
      memory_usage_percent: 72,
      disk_usage_percent: 58,
      api_response_time_ms: 450,
      db_connection_pool_usage_percent: 80,
    };

    // 合格基準をシステムデフォルト値として設定
    const pass_criteria = {
      cpu_usage_percent_max: 85,
      memory_usage_percent_max: 90,
      disk_usage_percent_max: 90,
      api_response_time_ms_max: 1000,
      db_connection_pool_usage_percent_max: 95,
    };

    // ヘルスチェック判定関数を実行
    const health_check_result = executeHealthCheck(system_metrics, pass_criteria);

    // 期待結果の検証
    expect(health_check_result.status).toBe('PASS');
    expect(health_check_result.cpu_usage_result).toBe('合格');
    expect(health_check_result.memory_usage_result).toBe('合格');
    expect(health_check_result.disk_usage_result).toBe('合格');
    expect(health_check_result.api_response_time_result).toBe('合格');
    expect(health_check_result.db_connection_pool_usage_result).toBe('合格');
  });
});