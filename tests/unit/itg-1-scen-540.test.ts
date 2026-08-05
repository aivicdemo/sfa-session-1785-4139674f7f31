import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-540
  test('分析対象期間の開始日が欠落している場合、エラーになる', () => {
    const input = {
      startDate: '',
      endDate: '2024-01-31',
      salesRepIds: ['rep_001', 'rep_002'],
      analysisMetrics: ['contact_frequency', 'proposal_success_rate', 'followup_interval'],
    };

    expect(() => generateSalesActivityAnalysisReport(input)).toThrow(/分析対象期間の開始日/);
  });
});