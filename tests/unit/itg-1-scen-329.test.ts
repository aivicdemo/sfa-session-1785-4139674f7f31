import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-329
  test('[edge] 行動パターン分析結果が0件の場合、レポートが正常に生成される', () => {
    const salesPersonId = 'SP001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';
    const generatedAt = new Date('2024-01-31T15:30:00Z');

    const report = generateBehaviorPatternAnalysisReport({
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      generatedAt,
      behaviorPatternResults: []
    });

    expect(report).toHaveProperty('salesPersonId');
    expect(report.salesPersonId).toBe(salesPersonId);

    expect(report).toHaveProperty('analysisStartDate');
    expect(report.analysisStartDate).toBe(analysisStartDate);

    expect(report).toHaveProperty('analysisEndDate');
    expect(report.analysisEndDate).toBe(analysisEndDate);

    expect(report).toHaveProperty('generatedAt');
    expect(report.generatedAt).toEqual(generatedAt);

    expect(report).toHaveProperty('resultCount');
    expect(report.resultCount).toBe(0);

    expect(report).toHaveProperty('status');
    expect(report.status).toBe('完了');

    expect(report).toHaveProperty('errors');
    expect(Array.isArray(report.errors)).toBe(true);
    expect(report.errors.length).toBe(0);
  });
});