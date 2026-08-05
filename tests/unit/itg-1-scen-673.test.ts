import { analyzeAndReportSalesPerformancePattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-673
  test('標準プロセス定義データが null のとき比較処理がエラーになる', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '山田太郎';
    const activity_count = 15;
    const proposal_success_rate = 0.65;
    const followup_interval_days = 3;
    const contract_rate = 0.45;
    const analysis_month = '2024-01';
    const standard_process_definition = null;

    expect(() =>
      analyzeAndReportSalesPerformancePattern({
        sales_rep_id,
        sales_rep_name,
        activity_count,
        proposal_success_rate,
        followup_interval_days,
        contract_rate,
        analysis_month,
        standard_process_definition,
      })
    ).toThrow(/INVALID_PROCESS_DEFINITION|標準プロセス定義データが不正です/);
  });
});