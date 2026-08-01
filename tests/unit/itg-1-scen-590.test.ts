import { describe, test, expect } from '@jest/globals';
import { judgeAlertReportingRequirement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-590
  test('問題検出結果の重要度スコアが報告対象の閾値ちょうどの場合報告対象に判定される', () => {
    const REPORTING_THRESHOLD = 80;
    const severity_score = 80;

    const detectionResult = {
      problem_id: 'PROB-001',
      detected_at: new Date('2024-01-15T10:30:00Z'),
      severity_score: severity_score,
      pattern_name: '提案内容と顧客対応パターンの乖離',
      affected_transaction_count: 3,
      category: 'proposal_pattern_deviation'
    };

    const result = judgeAlertReportingRequirement(detectionResult);

    expect(result.requires_reporting).toBe(true);
    expect(result.severity_judgment).toBe('報告対象');
    expect(result.judgment_threshold).toBe(REPORTING_THRESHOLD);
  });
});