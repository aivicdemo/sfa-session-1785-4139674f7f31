import { calculateSalesRepresentativeAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-602: [normal] 営業担当者の行動パターンと成約実績の自動分析・レポート機能 - 提案内容の乖離度と顧客対応パターンの合致度が同時に管理職に提示される
  test('営業担当者Aの30日間営業活動データから提案乖離度32%と顧客対応合致度78%を同時に計算してレポート画面に表示する', () => {
    const input = {
      salesRepresentativeId: 'sr_001_a',
      salesRepresentativeName: '営業担当者A',
      monthlyAchievementRate: 120,
      analysisStartDate: '2024-11-01T00:00:00Z',
      analysisEndDate: '2024-11-30T23:59:59Z',
      proposalCount: 15,
      proposalDivergenceScore: 32,
      customerResponsePatternAlignmentScore: 78,
      reportsToManagerUserId: 'mgr_001'
    };

    const result = calculateSalesRepresentativeAnalysisReport(input);

    expect(result).toEqual({
      analysisReportId: expect.any(String),
      salesRepresentativeId: 'sr_001_a',
      salesRepresentativeName: '営業担当者A',
      analysisPeriodStartDate: '2024-11-01T00:00:00Z',
      analysisPeriodEndDate: '2024-11-30T23:59:59Z',
      monthlyAchievementRate: 120,
      proposalCount: 15,
      proposalDivergenceScore: 32,
      customerResponsePatternAlignmentScore: 78,
      dashboardWidgetProposalDivergence: {
        metricType: 'proposal_divergence_percentage',
        displayLabel: '提案内容の乖離度',
        value: 32,
        unit: '%',
        description: '初期提案からの変更幅を数値化'
      },
      dashboardWidgetCustomerResponseAlignment: {
        metricType: 'customer_response_pattern_alignment_percentage',
        displayLabel: '顧客対応パターンの合致度',
        value: 78,
        unit: '%',
        description: '営業担当者Aの対応スタイルが成約顧客層に適合した度合い'
      },
      simultaneousDisplayEnabled: true,
      reportGeneratedAt: expect.any(String),
      targetManagerUserId: 'mgr_001',
      reportStatus: 'completed'
    });

    expect(result.dashboardWidgetProposalDivergence.value).toBe(32);
    expect(result.dashboardWidgetCustomerResponseAlignment.value).toBe(78);
    expect(result.proposalCount).toBe(15);
    expect(result.monthlyAchievementRate).toBe(120);
    expect(result.simultaneousDisplayEnabled).toBe(true);
  });
});