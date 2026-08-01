import { describe, test, expect } from '@jest/globals';
import { validateSystemHealthMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-228
  test('システムヘルスチェック判定機能 - システム稼働状況データが欠落しているとき例外が発生する', () => {
    const system_health_input_missing_cpu = {
      cpu_usage_percent: undefined,
      memory_usage_percent: 65.5,
      disk_free_gb: 250.0,
    };

    expect(() => validateSystemHealthMetrics(system_health_input_missing_cpu)).toThrow(
      /DATA_MISSING_ERROR/
    );
    expect(() => validateSystemHealthMetrics(system_health_input_missing_cpu)).toThrow(
      /Required system metrics are missing/
    );

    const system_health_input_missing_memory = {
      cpu_usage_percent: 45.2,
      memory_usage_percent: null,
      disk_free_gb: 250.0,
    };

    expect(() => validateSystemHealthMetrics(system_health_input_missing_memory)).toThrow(
      /DATA_MISSING_ERROR/
    );
    expect(() => validateSystemHealthMetrics(system_health_input_missing_memory)).toThrow(
      /Required system metrics are missing/
    );

    const system_health_input_missing_disk = {
      cpu_usage_percent: 45.2,
      memory_usage_percent: 65.5,
      disk_free_gb: undefined,
    };

    expect(() => validateSystemHealthMetrics(system_health_input_missing_disk)).toThrow(
      /DATA_MISSING_ERROR/
    );
    expect(() => validateSystemHealthMetrics(system_health_input_missing_disk)).toThrow(
      /Required system metrics are missing/
    );
  });
});