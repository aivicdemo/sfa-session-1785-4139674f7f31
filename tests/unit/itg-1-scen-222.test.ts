import { describe, test, expect } from '@jest/globals';
import { checkAIAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-222: [edge] システムヘルスチェック判定機能 - AIエージェント推論精度が合格基準をちょうど満たすとき合格判定が出力される', () => {
    const inference_accuracy_percent = 80.0;
    const passing_threshold_percent = 80.0;

    const result = checkAIAgentInferenceAccuracy({
      inference_accuracy_percent,
      passing_threshold_percent,
    });

    expect(result.judgment_result).toBe('合格');
    expect(result.status_code).toBe(200);
    expect(result.diagnostic_message).toBe(
      'AIエージェント推論精度: 80.0% - 基準値以上で合格'
    );
  });
});