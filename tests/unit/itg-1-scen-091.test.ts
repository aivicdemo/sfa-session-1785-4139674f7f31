import { validateLearningDataBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-091
  test('行動パターン分析結果が空の場合、推論実行が保留される', () => {
    const behavior_pattern_analysis_results: never[] = [];

    const result = validateLearningDataBeforeInference({
      behavior_pattern_analysis_results,
    });

    expect(result.inference_execution_status).toBe('PENDING');
    expect(result.is_inference_execution_allowed).toBe(false);
    expect(result.error_logs).toContain('行動パターン分析結果が空のため推論実行を保留します');
  });
});