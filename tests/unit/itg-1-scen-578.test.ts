import { detectAndJudgeReportingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-578
  test('[normal] 問題検出結果の重要度・対応必要性判定機能 - 重要度が最低レベルの検出結果は報告非対象に判定される', () => {
    const detectionResult = {
      salesOpportunityId: 'OPP-2024-001',
      detectionContent: '提案内容が標準プロセスから逸脱しています',
      severity: 'LOW',
      detectedAt: '2024-01-15T10:30:00Z',
    };

    const result = detectAndJudgeReportingTarget(detectionResult);

    expect(result.isReportingTarget).toBe(false);
    expect(result.actionRequiredStatus).toBe('NOT_REQUIRED');
  });
});