import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論実行前データ品質検証機能', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-135: [error] AIエージェント推論実行前データ品質検証機能 - 営業管理職がnullのとき推論実行指示が拒否される
  it('should reject inference execution when sales_manager_id is null with 400 Bad Request', async () => {
    const { validateInferenceExecutionPrerequisites } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const invalid_inference_request = {
      sales_manager_id: null,
      inference_trigger_date: new Date('2024-01-15T11:00:00Z').toISOString(),
      data_quality_check_status: 'completed',
      minimum_training_data_count: 1000,
      actual_training_data_count: 2500,
      data_quality_score: 0.96,
    };

    const mock_error_response = {
      status_code: 400,
      error_message: '営業管理職は必須フィールドです。推論実行前にデータを補完してください。',
      inference_allowed: false,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_error_response), {
      status: 400,
    });

    const result = await validateInferenceExecutionPrerequisites(
      invalid_inference_request
    );

    expect(result.status_code).toBe(400);
    expect(result.error_message).toMatch(/営業管理職/);
    expect(result.inference_allowed).toBe(false);

    const call_args = fetchMock.mock.calls[0];
    expect(call_args).toBeDefined();
  });
});