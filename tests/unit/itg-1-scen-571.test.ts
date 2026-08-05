import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

import {
  monitorInferenceAccuracyAndAlert,
} from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-571
  test('推論精度が閾値を大きく下回り外部監視サービス連携に失敗した場合、MonitoringServiceUnavailableErrorをスローする', async () => {
    const inference_accuracy_percent = 60;
    const accuracy_threshold_percent = 70;
    const monitoring_service_url = 'https://external-monitoring.example.com/alert';
    const request_timeout_ms = 5000;
    const timestamp_iso = '2024-01-15T11:00:00Z';
    const anomaly_alert_content = {
      timestamp: timestamp_iso,
      accuracy_percent: inference_accuracy_percent,
      threshold_percent: accuracy_threshold_percent,
      deviation_percent: accuracy_threshold_percent - inference_accuracy_percent,
      severity: 'HIGH',
      message: `Inference accuracy ${inference_accuracy_percent}% below threshold ${accuracy_threshold_percent}%`,
    };

    fetchMock.mockRejectOnce(new Error('Connection timeout'));

    await expect(
      monitorInferenceAccuracyAndAlert({
        current_accuracy_percent: inference_accuracy_percent,
        threshold_percent: accuracy_threshold_percent,
        external_service_url: monitoring_service_url,
        timeout_ms: request_timeout_ms,
        current_timestamp: timestamp_iso,
      })
    ).rejects.toThrow(/MonitoringServiceUnavailable/);

    expect(fetchMock).toHaveBeenCalledWith(
      monitoring_service_url,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('60'),
      })
    );
  });
});