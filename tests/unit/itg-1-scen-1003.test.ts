import { aggregateTeamComprehensionScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の理解度スコア集計機能', () => {
  // SCEN-1003
  test('理解度確認テスト提出が0件の場合、チーム全体の集計結果として件数0が正しく計算される', () => {
    const submissions: Array<{ score: number }> = [];

    const result = aggregateTeamComprehensionScores(submissions);

    expect(result.submission_count).toBe(0);
    expect(result.average_score).toBeNull();
    expect(result.total_score).toBe(0);
    expect(result.max_score).toBeNull();
    expect(result.min_score).toBeNull();
  });
});