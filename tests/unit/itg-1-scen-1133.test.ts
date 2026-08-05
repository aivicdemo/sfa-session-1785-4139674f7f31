import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T11:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    fetchMock.disableMocks();
  });

  // SCEN-1133
  test('外部AIサービスが応答しないとき、エラーコードと監査ログが返されること', async () => {
    const test_case_id = 'SCEN-1133';
    const external_ai_endpoint = 'https://external-ai-service.example.com/infer';
    const request_timeout_ms = 5000;
    const retry_count = 0;
    const timestamp_iso = '2024-01-15T11:00:00Z';
    const timestamp_display = '2024-01-15 11:00:00';

    fetchMock.mockRejectOnce(new Error('Network timeout'));

    const result = await monitorAiInferenceAccuracy({
      inference_request: {
        model_id: 'sales_prediction_v1',
        input_data: {
          salesperson_id: 'SP001',
          customer_id: 'C001',
          interaction_count: 5,
          proposal_success_rate: 0.65
        }
      },
      external_ai_service_url: external_ai_endpoint,
      timeout_ms: request_timeout_ms,
      audit_system_enabled: true
    }).catch(error => error);

    expect(result).toBeDefined();
    expect(result.error_code).toBe('EXTERNAL_AI_SERVICE_UNAVAILABLE');
    expect(result.error_message).toMatch(/外部AIサービス応答タイムアウト/);
    expect(result.audit_log).toBeDefined();
    expect(result.audit_log.message).toMatch(
      new RegExp(
        `外部AIサービス応答タイムアウト\\(タイムスタンプ: ${timestamp_display}、リトライ回数: ${retry_count}\\)`
      )
    );
    expect(result.alert_status).toBe('外部AI連携エラー');
    expect(result.alert_triggered_at).toBe(timestamp_iso);
    expect(result.retry_count).toBe(retry_count);
  });
});