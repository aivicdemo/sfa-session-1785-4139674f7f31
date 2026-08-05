import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1110
  test('標準プロセス定義IDが欠落しているとき、処理がエラーになること', () => {
    const sales_rep_id = 'sales_001';
    const process_definition_id = null;
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        sales_rep_id,
        process_definition_id,
        analysis_period_start,
        analysis_period_end,
      })
    ).toThrow(/標準プロセス定義ID/);
  });
});