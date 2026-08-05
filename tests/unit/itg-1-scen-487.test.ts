import { it, describe, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-487
  it('監視対象のAIエージェントIDが欠落している場合、エラーを返す', async () => {
    const monitoring_request_payload = {
      agent_id: null,
      monitoring_start_timestamp: '2024-01-15T11:00:00Z',
      check_interval_minutes: 30,
    };

    const expected_error_response = {
      error: 'AIエージェントIDは必須です',
      code: 'AGENT_ID_REQUIRED',
    };

    fetchMock.mockResponseOnce(
      JSON.stringify(expected_error_response),
      { status: 400 }
    );

    const response = await fetch('/api/ai-agent-monitoring/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monitoring_request_payload),
    });

    expect(response.status).toBe(400);

    const response_body = await response.json();
    expect(response_body).toEqual(expected_error_response);
    expect(response_body.error).toMatch(/AIエージェントID/);
    expect(response_body.code).toBe('AGENT_ID_REQUIRED');
  });
});