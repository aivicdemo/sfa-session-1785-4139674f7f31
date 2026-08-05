import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-538
  test('営業担当者IDが欠落している場合、エラーになる', async () => {
    const requestWithEmptySalesRepId = {
      salesRepId: '',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      includeCorrelationAnalysis: true,
    };

    const requestWithNullSalesRepId = {
      salesRepId: null,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      includeCorrelationAnalysis: true,
    };

    // Test with empty string
    try {
      await generateSalesRepBehaviorAnalysisReport(requestWithEmptySalesRepId);
      fail('Expected error to be thrown for empty salesRepId');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/営業担当者ID/);
      }
    }

    // Test with null
    try {
      await generateSalesRepBehaviorAnalysisReport(requestWithNullSalesRepId);
      fail('Expected error to be thrown for null salesRepId');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/営業担当者ID/);
      }
    }
  });
});