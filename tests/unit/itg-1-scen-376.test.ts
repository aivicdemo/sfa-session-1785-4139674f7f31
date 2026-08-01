import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-376
  test('[edge] 改善課題が0件のとき、改善課題なしが返される', () => {
    const salesPersonId = 'SP-001';
    const analysisStartDate = '2024-01-01T00:00:00Z';
    const analysisEndDate = '2024-01-31T23:59:59Z';
    const behaviorPatternData = {
      salesPersonId: salesPersonId,
      totalActivities: 45,
      initialContactFrequency: 12,
      proposalSuccessRate: 0.85,
      followUpInterval: 3.2,
      customerResponseRate: 0.92,
      processComplianceScore: 0.98,
      contractAchievementRate: 0.78,
      deviationPatterns: [],
      detectedIssues: []
    };

    const report = generateBehaviorPatternAnalysisReport(
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      behaviorPatternData
    );

    expect(report.improvementIssues).toEqual([]);
    expect(report.improvementIssueCount).toBe(0);
    expect(report.hasImprovementNeeds).toBe(false);
  });
});