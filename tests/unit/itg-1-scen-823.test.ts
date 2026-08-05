import { reviewAndJudgeProblemDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-823
  test('[error] 問題検出結果のレビュー・判定機能 - 問題検出結果IDが欠落している場合にエラーになること', () => {
    const request_with_null_id = {
      problem_detection_result_id: null,
      reviewer_id: 'reviewer_001',
      severity_level: 'high',
      action_required: true,
    };

    const request_with_undefined_id = {
      problem_detection_result_id: undefined,
      reviewer_id: 'reviewer_001',
      severity_level: 'high',
      action_required: true,
    };

    const request_with_empty_string_id = {
      problem_detection_result_id: '',
      reviewer_id: 'reviewer_001',
      severity_level: 'high',
      action_required: true,
    };

    expect(() => reviewAndJudgeProblemDetectionResult(request_with_null_id as any)).toThrow(/問題検出結果ID/);
    expect(() => reviewAndJudgeProblemDetectionResult(request_with_undefined_id as any)).toThrow(/問題検出結果ID/);
    expect(() => reviewAndJudgeProblemDetectionResult(request_with_empty_string_id as any)).toThrow(/問題検出結果ID/);
  });
});