import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { reviewDetectionResultWithInferenceLogValidation } from '../../src/logic/it-1-br-2-1-1-1';

fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-842
  test('[error] 問題検出結果のレビュー・判定機能 - AIエージェント推論ログへの問題検出結果の紐付けができない場合にエラーになること', async () => {
    const detection_result_id = 'DET-20240115-001';
    const invalid_inference_log_id = 'INVALID-LOG-999';
    const initial_status = 'REVIEW_PENDING';

    const detection_result = {
      id: detection_result_id,
      inference_log_id: invalid_inference_log_id,
      status: initial_status,
      severity: 'HIGH',
      issue_description: 'Proposal content deviation from standard process detected',
      detection_timestamp: '2024-01-15T10:30:00Z',
    };

    const api_endpoint = `/api/v1/inference-logs/${invalid_inference_log_id}`;

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'Not Found',
        message: `Inference log with ID ${invalid_inference_log_id} does not exist`,
      }),
      { status: 404 }
    );

    await expect(
      reviewDetectionResultWithInferenceLogValidation(detection_result, api_endpoint)
    ).rejects.toThrow(/紐付けされたAIエージェント推論ログ/);

    expect(detection_result.status).toBe(initial_status);
  });
});