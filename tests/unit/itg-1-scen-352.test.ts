import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-352
  test('営業担当者の行動ログが0件のとき、行動パターンが未抽出状態で返される', () => {
    const salesPersonId = 'sales_001';
    const reportPeriodStart = new Date('2024-01-01T00:00:00Z');
    const reportPeriodEnd = new Date('2024-01-31T23:59:59Z');

    const mockBehaviorLogs = [];

    const result = generateBehaviorPatternAnalysisReport({
      salesPersonId,
      behaviorLogs: mockBehaviorLogs,
      reportPeriodStart,
      reportPeriodEnd,
    });

    expect(result.statusCode).toBe(200);
    expect(result.report.behaviorPatternAnalysis).toBeNull();
    expect(result.report.extractedPatterns).toEqual([]);
    expect(result.report.salesPersonId).toBe(salesPersonId);
    expect(result.report.periodStart).toEqual(reportPeriodStart);
    expect(result.report.periodEnd).toEqual(reportPeriodEnd);
    expect(result.report.totalBehaviorCount).toBe(0);
    expect(result.report.analysisStatus).toBe('未抽出');
  });
});