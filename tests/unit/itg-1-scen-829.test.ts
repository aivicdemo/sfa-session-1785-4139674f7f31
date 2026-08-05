import { reviewDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-829
  test('検出根拠情報が欠落している場合にエラーになること', () => {
    const detection_result_with_missing_evidence = {
      detection_result_id: 'DET-001',
      detection_rule_id: null,
      detection_datetime: null,
      detection_location: null,
      issue_description: '提案内容が標準プロセスから乖離している',
      severity: 'high',
      review_status: 'unreviewed',
      detected_at: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() =>
      reviewDetectionResult({
        detection_result: detection_result_with_missing_evidence,
        reviewer_decision: 'approved',
        reviewer_id: 'MGR-001',
        review_timestamp: new Date('2024-01-15T11:00:00Z'),
      })
    ).toThrow(/検出根拠情報/);
  });
});