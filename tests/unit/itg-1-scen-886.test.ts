import { analyzeTeamSalesQualityMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-886
  test('営業担当者のフォローアップ成功率がマイナス値のとき、エラーになる', () => {
    const input = {
      salesRepresentativeId: 'rep_001',
      followUpSuccessRate: -5,
      proposalAccuracyScore: 85.5,
      processComplianceRate: 92.0,
      analysisMonth: '2024-01-01T00:00:00Z'
    };

    expect(() => analyzeTeamSalesQualityMetrics(input)).toThrow(/フォローアップ成功率/);
  });
});