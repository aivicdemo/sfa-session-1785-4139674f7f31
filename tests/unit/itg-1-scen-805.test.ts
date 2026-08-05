import { calculateIssueImportanceLevel } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-805
  test('問題検出結果の重要度・優先度分類機能 - 営業パフォーマンスが業務上の最大規模の場合、重要度分類に影響しない', () => {
    const salesLimitMillion = 10;
    const basePerformanceMillion = 10;
    const excessivePerformanceMillion = 15;
    const detectedIssue = {
      issueId: 'issue_001',
      issueType: 'process_deviation',
      description: 'プロセス逸脱が検出されました',
      frequencyCount: 3,
      affectedDealCount: 5,
      customerImpactLevel: 'medium' as const,
    };

    const importanceLevelAt100Percent = calculateIssueImportanceLevel({
      issue: detectedIssue,
      monthlySalesLimitMillion: salesLimitMillion,
      actualSalesPerformanceMillion: basePerformanceMillion,
      processComplianceRate: 85,
      dataQualityScore: 92,
    });

    const importanceLevelAt150Percent = calculateIssueImportanceLevel({
      issue: detectedIssue,
      monthlySalesLimitMillion: salesLimitMillion,
      actualSalesPerformanceMillion: excessivePerformanceMillion,
      processComplianceRate: 85,
      dataQualityScore: 92,
    });

    expect(importanceLevelAt150Percent).toBe(importanceLevelAt100Percent);
  });
});