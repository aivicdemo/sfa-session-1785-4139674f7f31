import { validateDataQualityBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前データ品質検証機能', () => {
  // SCEN-131: [error] AIエージェント推論実行前データ品質検証機能 - データ品質スコアが良好基準未満のとき推論実行が保留される
  test('should reject inference execution when data quality score is below threshold', () => {
    const input_data_quality_score = 45;
    const quality_threshold = 60;
    const expected_status_code = 400;
    const expected_inference_state = 'pending';
    const expected_log_message = 'データ品質スコア45が基準値60未満のため推論実行を保留しました';

    const result = validateDataQualityBeforeInference({
      dataQualityScore: input_data_quality_score,
      qualityThreshold: quality_threshold,
    });

    expect(result.statusCode).toBe(expected_status_code);
    expect(result.inferenceState).toBe(expected_inference_state);
    expect(result.logMessage).toMatch(/データ品質スコア/);
    expect(result.logMessage).toMatch(/基準値/);
    expect(result.canProceedWithInference).toBe(false);
  });
});