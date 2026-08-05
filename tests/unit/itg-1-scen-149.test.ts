import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  test('SCEN-149: 成約実績が空（null）のときレポート生成が失敗する', () => {
    // Arrange
    const sales_rep_id = 'TEST-001';
    const sales_rep_name = 'テスト太郎';
    const visit_count = 5;
    const proposal_count = 3;
    const sales_performance = null;

    const input_data = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_count: visit_count,
      proposal_count: proposal_count,
      sales_performance: sales_performance,
    };

    // Act & Assert
    expect(() => generateSalesPerformanceAnalysisReport(input_data)).toThrow(/成約実績/);
  });
});