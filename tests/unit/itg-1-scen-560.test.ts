import { describe, test, expect } from '@jest/globals';
import { validateInferenceLogsForMonitoring } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-560
  test('AIエージェント推論ログが空配列の場合、エラーになる', () => {
    const empty_inference_logs: any[] = [];

    expect(() => {
      validateInferenceLogsForMonitoring(empty_inference_logs);
    }).toThrow(/推論ログ/);
  });
});