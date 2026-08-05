import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1114
  test('営業プロセス定義が存在しないとき、処理がエラーになること', () => {
    const sales_rep_id = 'SR001';
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');
    const report_format = 'pdf';

    const mock_process_definitions_empty: any[] = [];

    const fn_call = () => {
      return generateSalesActivityPatternAnalysisReport({
        sales_rep_id,
        analysis_start_date,
        analysis_end_date,
        report_format,
        process_definitions: mock_process_definitions_empty,
      });
    };

    expect(fn_call).toThrow(/営業プロセス定義/);
  });
});