import { calculateDeterminationPeriodWithFiscalYearBoundary } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-858: [edge] 問題検出結果の重要度・根拠・対応必要性判定機能 - 検出期間が年度をまたぐとき判定期間の計算が正確に行われる
  test('年度境界をまたぐ検出期間で判定期間の日数と会計年度数を正確に計算する', () => {
    const start_date = new Date('2023-02-01T00:00:00Z');
    const end_date = new Date('2024-04-30T23:59:59Z');
    const fiscal_year_start_month = 4;

    const result = calculateDeterminationPeriodWithFiscalYearBoundary(
      start_date,
      end_date,
      fiscal_year_start_month
    );

    expect(result.determination_period_days).toBe(489);
    expect(result.fiscal_year_count).toBe(2);
    expect(result.fiscal_years_covered).toEqual([2023, 2024]);
  });
});