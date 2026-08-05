import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-469
  test('営業担当者IDが空文字列の場合、エラーを返す', () => {
    const sales_person_id = '';
    const analysis_period_start = '2024-01-01T00:00:00Z';
    const analysis_period_end = '2024-01-31T23:59:59Z';

    const result = generateSalesPersonAnalysisReport({
      sales_person_id,
      analysis_period_start,
      analysis_period_end,
    });

    expect(result.status_code).toBe(400);
    expect(result.error_message).toMatch(/営業担当者ID/);
  });
});