import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-358
  test('成約率が50%未満のとき、正しく計算される', () => {
    const input = {
      salesRepId: 'SR001',
      salesRepName: '山田太郎',
      closedDealsCount: 20,
      proposalCount: 50,
      analysisMonth: '2024-01',
      contactFrequency: 5.2,
      followUpSuccessRate: 35.0,
      processComplianceScore: 72.5,
    };

    const result = generateSalesRepBehaviorAnalysisReport(input);

    expect(result.conversionRate).toBe(40.0);
    expect(result.conversionRateCategory).toBe('低（50%未満）');
    expect(result.improvementRecommendations).toContain('提案プロセスの見直し');
    expect(result.salesRepId).toBe('SR001');
    expect(result.salesRepName).toBe('山田太郎');
    expect(result.analysisMonth).toBe('2024-01');
    expect(Array.isArray(result.improvementRecommendations)).toBe(true);
    expect(result.improvementRecommendations.length).toBeGreaterThan(0);
  });
});