import { reviewAndJudgeProblemDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-830
  test('[error] 問題検出結果のレビュー・判定機能 - 検出根拠情報が空文字列の場合にエラーになること', () => {
    const input = {
      detection_result_id: 'det_001',
      detection_date: '2024-01-15T10:30:00Z',
      problem_type: 'proposal_quality_deviation',
      severity_level: 'high',
      evidence_reason: '',
      review_status: 'reviewed',
      reviewer_id: 'mgr_001',
      review_date: '2024-01-15T11:00:00Z',
      judgment_date: '2024-01-15T11:00:00Z',
    };

    expect(() => reviewAndJudgeProblemDetectionResult(input)).toThrow(
      /VALIDATION_ERROR_EMPTY_EVIDENCE_REASON/
    );
  });
});