import { describe, test, expect } from '@jest/globals';
import { validateInferenceTimestampForMonitoring } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-689
  test('推論実行日時が null のとき監視対象期間の判定に失敗しエラーになる', () => {
    const inference_record = {
      inference_id: 'inf_001',
      execution_timestamp: null,
      model_version: 'v1.0',
      confidence_score: 85
    };

    const error_thrown = expect(() =>
      validateInferenceTimestampForMonitoring(inference_record)
    ).toThrow(/推論実行日時/);

    try {
      validateInferenceTimestampForMonitoring(inference_record);
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      expect(error.code).toBe('INFERENCE_TIMESTAMP_NULL');
      expect(String(error.message)).toMatch(
        /推論実行日時が未設定のため監視対象期間を判定できません/
      );
      expect(String(error.stack)).toMatch(/validateInferenceTimestampForMonitoring/);
    }
  });
});