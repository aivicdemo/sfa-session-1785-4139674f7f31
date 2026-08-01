import { analyzeContactPatternIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-762
  test('分析期間の開始日と終了日が同日の場合、その1日のデータのみが対象となる', () => {
    const analysis_start_date = new Date('2024-01-15T00:00:00Z');
    const analysis_end_date = new Date('2024-01-15T23:59:59Z');
    const sales_rep_id = 'SR001';
    const min_data_points = 5;

    const result = analyzeContactPatternIndicators({
      analysis_start_date,
      analysis_end_date,
      sales_rep_id,
      min_data_points,
    });

    expect(result.target_date_range_start).toEqual(
      new Date('2024-01-15T00:00:00Z')
    );
    expect(result.target_date_range_end).toEqual(
      new Date('2024-01-15T23:59:59Z')
    );
    expect(result.data_collection_period_days).toBe(1);
    expect(Array.isArray(result.selected_indicators)).toBe(true);
    expect(result.selected_indicators.length).toBeGreaterThan(0);
  });
});