import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1107
  test('営業担当者IDが空文字列のとき、処理がエラーになること', () => {
    const empty_sales_person_id = '';
    const analysis_start_date = '2024-01-01T00:00:00Z';
    const analysis_end_date = '2024-01-31T23:59:59Z';

    expect(() =>
      generateSalesPersonActionPatternAnalysisReport({
        sales_person_id: empty_sales_person_id,
        start_date: analysis_start_date,
        end_date: analysis_end_date,
      })
    ).toThrow(/営業担当者ID/);
  });
});