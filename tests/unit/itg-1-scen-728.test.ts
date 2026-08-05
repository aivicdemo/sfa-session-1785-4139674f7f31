import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiInferencePrecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockAlertRepository: any;
  let mockPrecisionMonitor: any;

  beforeEach(() => {
    mockAlertRepository = {
      create: jest.fn().mockResolvedValue({
        alert_id: 'ALT-001',
        alert_level: 'HIGH',
        alert_code: 'INFERENCE_PRECISION_BELOW_THRESHOLD',
        message: 'AIエージェント推論精度が79%で合格閾値80%を下回っています',
        created_at: new Date('2024-01-15T11:30:00Z'),
        recorded_at: new Date('2024-01-15T11:30:00Z'),
      }),
    };

    mockPrecisionMonitor = {
      getCurrentInferencePrecision: jest.fn().mockResolvedValue(0.79),
      getThresholdPrecision: jest.fn().mockResolvedValue(0.80),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-728
  test('推論精度が合格閾値を下回る場合に自動アラートが生成される', async () => {
    const input_precision_percent = 79;
    const input_threshold_percent = 80;
    const input_salesperson_id = 'SP-001';
    const input_analysis_timestamp = new Date('2024-01-15T11:30:00Z');

    const result = await monitorAiInferencePrecision(
      {
        current_precision: input_precision_percent,
        threshold_precision: input_threshold_percent,
        salesperson_id: input_salesperson_id,
        monitoring_timestamp: input_analysis_timestamp,
        alert_repository: mockAlertRepository,
      }
    );

    expect(result).toBeDefined();
    expect(result.alert_generated).toBe(true);
    expect(result.alert_level).toBe('HIGH');
    expect(result.alert_code).toBe('INFERENCE_PRECISION_BELOW_THRESHOLD');
    expect(result.message).toBe('AIエージェント推論精度が79%で合格閾値80%を下回っています');
    expect(result.precision_value).toBe(79);
    expect(result.threshold_value).toBe(80);
    expect(result.alert_count).toBe(1);
    expect(mockAlertRepository.create).toHaveBeenCalledTimes(1);
    expect(mockAlertRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        alert_level: 'HIGH',
        alert_code: 'INFERENCE_PRECISION_BELOW_THRESHOLD',
        message: 'AIエージェント推論精度が79%で合格閾値80%を下回っています',
        salesperson_id: input_salesperson_id,
        recorded_at: input_analysis_timestamp,
      })
    );
  });
});