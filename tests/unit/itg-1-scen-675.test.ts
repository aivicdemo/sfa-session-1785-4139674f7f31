import { describe, test, expect } from '@jest/globals';
import { analyzeAndGenerateSalesReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-675
  test('営業担当者IDが空文字列のとき分析対象の特定に失敗しエラーになる', () => {
    const empty_sales_person_id = '';
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');

    expect(() => {
      analyzeAndGenerateSalesReport({
        sales_person_id: empty_sales_person_id,
        start_date: analysis_start_date,
        end_date: analysis_end_date,
      });
    }).toThrow(/SALES_PERSON_ID_EMPTY/);
  });
});