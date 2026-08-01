import { evaluateIssueReportRequirement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-607
  test('重要度スコアが0の場合報告非対象と判定される', () => {
    const detectionResult = {
      severityScore: 0,
      detectionTime: new Date('2024-01-15T11:00:00Z'),
      issueType: 'deviation_pattern',
      affectedSalesPersonId: 'sp_001',
      correlatedOutcome: 'low_contract_rate'
    };

    const judgmentResult = evaluateIssueReportRequirement(detectionResult);

    expect(judgmentResult.reportRequired).toBe(false);
  });
});