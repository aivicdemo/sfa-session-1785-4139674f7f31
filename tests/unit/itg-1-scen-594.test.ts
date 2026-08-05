import { analyzeSalesProcessExecutionStatus } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-594
  test('分析対象の営業案件データが時系列と逆順で保存されている場合、グラフ描画時に昇順ソートして正しく表示する', () => {
    const reverse_order_cases = [
      {
        id: 'case_a',
        date: new Date('2024-01-15T10:00:00Z'),
        name: '案件A',
      },
      {
        id: 'case_b',
        date: new Date('2024-01-10T10:00:00Z'),
        name: '案件B',
      },
      {
        id: 'case_c',
        date: new Date('2024-01-05T10:00:00Z'),
        name: '案件C',
      },
    ];

    const result = analyzeSalesProcessExecutionStatus({
      cases: reverse_order_cases,
      target_period_start: new Date('2024-01-01T00:00:00Z'),
      target_period_end: new Date('2024-01-31T23:59:59Z'),
    });

    expect(result.sorted_cases).toHaveLength(3);
    expect(result.sorted_cases[0].id).toBe('case_c');
    expect(result.sorted_cases[0].name).toBe('案件C');
    expect(result.sorted_cases[0].date).toEqual(
      new Date('2024-01-05T10:00:00Z'),
    );

    expect(result.sorted_cases[1].id).toBe('case_b');
    expect(result.sorted_cases[1].name).toBe('案件B');
    expect(result.sorted_cases[1].date).toEqual(
      new Date('2024-01-10T10:00:00Z'),
    );

    expect(result.sorted_cases[2].id).toBe('case_a');
    expect(result.sorted_cases[2].name).toBe('案件A');
    expect(result.sorted_cases[2].date).toEqual(
      new Date('2024-01-15T10:00:00Z'),
    );

    expect(result.graph_x_axis_order).toEqual([
      '2024-01-05',
      '2024-01-10',
      '2024-01-15',
    ]);

    expect(result.is_chronological_ascending).toBe(true);
  });
});