import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-413
  test('レポートに含まれる乖離度の値が1.0の場合、正確に表示される', () => {
    const salesPersonId = 'sales_001';
    const analysisData = {
      sales_person_id: salesPersonId,
      deviation_index: 1.0,
      process_adherence_score: 75.5,
      contract_count: 12,
      proposal_success_rate: 0.68,
      followup_frequency: 4.2,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    };

    const report = generateSalesPersonBehaviorAnalysisReport(analysisData);

    expect(report.deviation_index).toBe(1.0);
    expect(typeof report.deviation_index).toBe('number');
    expect(report.deviation_index_display).toBe('1.0');
    expect(report.sales_person_id).toBe(salesPersonId);
  });
});