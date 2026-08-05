import { calculatePeriodAggregation } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - 期間集計', () => {
  // SCEN-211
  test('変換作業の開始日が月末のとき、期間集計が正しく計算される', () => {
    const start_date = new Date('2024-01-31T00:00:00Z');
    const end_date = new Date('2024-02-29T23:59:59Z');

    const daily_conversion_counts = [
      { date: '2024-01-31', count: 3 },
      { date: '2024-02-01', count: 5 },
      { date: '2024-02-02', count: 4 },
      { date: '2024-02-03', count: 2 },
      { date: '2024-02-04', count: 6 },
      { date: '2024-02-05', count: 1 },
      { date: '2024-02-06', count: 4 },
      { date: '2024-02-07', count: 3 },
      { date: '2024-02-08', count: 5 },
      { date: '2024-02-09', count: 2 },
      { date: '2024-02-10', count: 3 },
      { date: '2024-02-11', count: 4 },
      { date: '2024-02-12', count: 2 },
      { date: '2024-02-13', count: 5 },
      { date: '2024-02-14', count: 1 },
      { date: '2024-02-15', count: 3 },
      { date: '2024-02-16', count: 2 },
      { date: '2024-02-17', count: 4 },
      { date: '2024-02-18', count: 6 },
      { date: '2024-02-19', count: 2 },
      { date: '2024-02-20', count: 3 },
      { date: '2024-02-21', count: 5 },
      { date: '2024-02-22', count: 1 },
      { date: '2024-02-23', count: 4 },
      { date: '2024-02-24', count: 3 },
      { date: '2024-02-25', count: 2 },
      { date: '2024-02-26', count: 5 },
      { date: '2024-02-27', count: 4 },
      { date: '2024-02-28', count: 3 },
      { date: '2024-02-29', count: 2 },
    ];

    const result = calculatePeriodAggregation({
      start_date,
      end_date,
      daily_conversion_counts,
    });

    expect(result).toEqual({
      period_start: '2024-01-31',
      period_end: '2024-02-29',
      total_days: 31,
      total_conversions: 110,
      daily_breakdown: [
        { date: '2024-01-31', daily_count: 3, cumulative_count: 3 },
        { date: '2024-02-01', daily_count: 5, cumulative_count: 8 },
        { date: '2024-02-02', daily_count: 4, cumulative_count: 12 },
        { date: '2024-02-03', daily_count: 2, cumulative_count: 14 },
        { date: '2024-02-04', daily_count: 6, cumulative_count: 20 },
        { date: '2024-02-05', daily_count: 1, cumulative_count: 21 },
        { date: '2024-02-06', daily_count: 4, cumulative_count: 25 },
        { date: '2024-02-07', daily_count: 3, cumulative_count: 28 },
        { date: '2024-02-08', daily_count: 5, cumulative_count: 33 },
        { date: '2024-02-09', daily_count: 2, cumulative_count: 35 },
        { date: '2024-02-10', daily_count: 3, cumulative_count: 38 },
        { date: '2024-02-11', daily_count: 4, cumulative_count: 42 },
        { date: '2024-02-12', daily_count: 2, cumulative_count: 44 },
        { date: '2024-02-13', daily_count: 5, cumulative_count: 49 },
        { date: '2024-02-14', daily_count: 1, cumulative_count: 50 },
        { date: '2024-02-15', daily_count: 3, cumulative_count: 53 },
        { date: '2024-02-16', daily_count: 2, cumulative_count: 55 },
        { date: '2024-02-17', daily_count: 4, cumulative_count: 59 },
        { date: '2024-02-18', daily_count: 6, cumulative_count: 65 },
        { date: '2024-02-19', daily_count: 2, cumulative_count: 67 },
        { date: '2024-02-20', daily_count: 3, cumulative_count: 70 },
        { date: '2024-02-21', daily_count: 5, cumulative_count: 75 },
        { date: '2024-02-22', daily_count: 1, cumulative_count: 76 },
        { date: '2024-02-23', daily_count: 4, cumulative_count: 80 },
        { date: '2024-02-24', daily_count: 3, cumulative_count: 83 },
        { date: '2024-02-25', daily_count: 2, cumulative_count: 85 },
        { date: '2024-02-26', daily_count: 5, cumulative_count: 90 },
        { date: '2024-02-27', daily_count: 4, cumulative_count: 94 },
        { date: '2024-02-28', daily_count: 3, cumulative_count: 97 },
        { date: '2024-02-29', daily_count: 2, cumulative_count: 110 },
      ],
    });
  });
});