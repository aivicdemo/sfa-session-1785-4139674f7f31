import { describe, test, expect } from '@jest/globals';
import { analyzeActionPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-539: 営業担当者IDが空文字列の場合、エラーになる', () => {
    const invalid_sales_person_id = '';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      analyzeActionPatternReport({
        sales_person_id: invalid_sales_person_id,
        period_start: analysis_period_start,
        period_end: analysis_period_end,
      })
    ).toThrow(/営業担当者ID/);
  });
});