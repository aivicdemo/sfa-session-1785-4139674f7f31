import { judgeIssueImportanceAndNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-586
  test('分析結果が欠落している検出結果はエラーとして拒否される', () => {
    const detectionResult = {
      detection_id: 'DET-001',
      issue_type: 'PROPOSAL_DEVIATION',
      detected_at: new Date('2024-01-15T11:00:00Z'),
      affected_sales_person_id: 'SP-001',
      analysis_result: null,
      customer_response_pattern: 'NO_RESPONSE',
      severity_level: undefined,
      is_response_necessary: undefined,
    };

    expect(() => judgeIssueImportanceAndNecessity(detectionResult)).toThrow(
      /分析結果/
    );
  });
});