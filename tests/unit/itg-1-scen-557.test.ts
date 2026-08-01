import { groupProblemesByResponseTime } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-557: 対応時期別の問題グループ化機能 - 中期対応の問題が正しくグループ分けされる', () => {
    // テスト用の問題データセットを準備
    const problemDataset = [
      // 短期（30日以内）の問題 2件
      {
        problem_id: 'short_1',
        description: '短期対応問題1',
        detected_at: new Date('2024-01-01T10:00:00Z'),
        response_time_days: 15,
      },
      {
        problem_id: 'short_2',
        description: '短期対応問題2',
        detected_at: new Date('2024-01-02T10:00:00Z'),
        response_time_days: 28,
      },
      // 中期（31〜90日以内）の問題 3件
      {
        problem_id: 'medium_1',
        description: '中期対応問題1',
        detected_at: new Date('2024-01-03T10:00:00Z'),
        response_time_days: 31,
      },
      {
        problem_id: 'medium_2',
        description: '中期対応問題2',
        detected_at: new Date('2024-01-04T10:00:00Z'),
        response_time_days: 60,
      },
      {
        problem_id: 'medium_3',
        description: '中期対応問題3',
        detected_at: new Date('2024-01-05T10:00:00Z'),
        response_time_days: 90,
      },
      // 長期（91日以上）の問題 2件
      {
        problem_id: 'long_1',
        description: '長期対応問題1',
        detected_at: new Date('2024-01-06T10:00:00Z'),
        response_time_days: 91,
      },
      {
        problem_id: 'long_2',
        description: '長期対応問題2',
        detected_at: new Date('2024-01-07T10:00:00Z'),
        response_time_days: 180,
      },
    ];

    // グループ化関数に問題データセットを入力として渡す
    const grouping_result = groupProblemesByResponseTime(problemDataset);

    // 戻り値から『中期』グループを取得する
    const medium_group = grouping_result.medium;

    // 『中期』グループ内の問題件数をアサートする
    expect(medium_group.length).toBe(3);

    // 『中期』グループ内の各問題について、対応時期が『中期（31〜90日以内）』であることをアサートする
    medium_group.forEach((problem) => {
      expect(problem.response_time_days).toBeGreaterThanOrEqual(31);
      expect(problem.response_time_days).toBeLessThanOrEqual(90);
    });

    // 『中期』グループ内に『短期』または『長期』の問題が含まれていないことをアサートする
    const all_problem_ids_in_medium = medium_group.map((p) => p.problem_id);
    expect(all_problem_ids_in_medium).not.toContain('short_1');
    expect(all_problem_ids_in_medium).not.toContain('short_2');
    expect(all_problem_ids_in_medium).not.toContain('long_1');
    expect(all_problem_ids_in_medium).not.toContain('long_2');

    // 『中期』グループに期待される問題IDがすべて含まれていることをアサートする
    expect(all_problem_ids_in_medium).toContain('medium_1');
    expect(all_problem_ids_in_medium).toContain('medium_2');
    expect(all_problem_ids_in_medium).toContain('medium_3');
  });
});