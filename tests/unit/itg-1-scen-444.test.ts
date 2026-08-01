import { analyzeActionPatternAndSalesResult } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-444
  test('顧客対応記録が空の状態で分析が実行される場合、顧客対応記録なしとして処理される', () => {
    const salespersonId = 'SP001';
    const analysisResult = analyzeActionPatternAndSalesResult({
      salespersonId,
      actionRecords: [],
      salesResults: [],
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    expect(analysisResult.status).toBe('顧客対応記録なし');
    expect(analysisResult.actionPatterns).toEqual([]);
    expect(analysisResult.salesResultData).toEqual([]);
    expect(analysisResult.recommendedActions).toEqual([]);
  });
});