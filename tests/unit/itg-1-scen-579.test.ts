import { judgeReportingTargetByProblemSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-579: 重要度が中間レベルの検出結果は基準に従い報告対象が判定される', () => {
    const problemDetectionResult = {
      problemId: 'PROB-001',
      severity: 'MEDIUM',
      detectionTimestamp: new Date('2024-01-15T11:30:00Z'),
      description: '営業担当者の提案内容が標準プロセスから乖離している',
      affectedCount: 5,
      correlationWithContractResult: 0.65,
    };

    const judgmentResult = judgeReportingTargetByProblemSeverity(problemDetectionResult);

    expect(judgmentResult.shouldReportToManager).toBe(true);
    expect(judgmentResult.severity).toBe('MEDIUM');
    expect(judgmentResult.judgedAt).toEqual(expect.any(Date));
  });
});