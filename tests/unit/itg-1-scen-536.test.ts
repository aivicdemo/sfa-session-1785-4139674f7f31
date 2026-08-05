import { analyzeTeamImprovementNeeds } from '../../src/logic/it-1-br-2-1-1';

describe('チーム全体の改善課題の数値化と提示機能', () => {
  // SCEN-536
  test('失敗パターン分析から共通の改善推奨項目が数値化されて抽出される', () => {
    const failure_patterns = [
      { pattern_id: 'fail_a_1', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_a_2', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_a_3', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_a_4', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_a_5', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_b_1', pattern_name: '顧客ニーズ把握不足' },
      { pattern_id: 'fail_b_2', pattern_name: '顧客ニーズ把握不足' },
      { pattern_id: 'fail_b_3', pattern_name: '顧客ニーズ把握不足' },
      { pattern_id: 'fail_b_4', pattern_name: '顧客ニーズ把握不足' },
      { pattern_id: 'fail_c_1', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_c_2', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_c_3', pattern_name: '提案資料の品質不足' },
      { pattern_id: 'fail_d_1', pattern_name: 'フォローアップ遅延' },
      { pattern_id: 'fail_d_2', pattern_name: 'フォローアップ遅延' },
    ];

    const total_patterns = failure_patterns.length;

    const result = analyzeTeamImprovementNeeds(failure_patterns);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    expect(result[0]).toEqual({
      improvement_item: '提案資料の品質不足',
      occurrence_count: 8,
      occurrence_rate: 53.3,
      priority_rank: 1,
    });

    expect(result[1]).toEqual({
      improvement_item: '顧客ニーズ把握不足',
      occurrence_count: 4,
      occurrence_rate: 26.7,
      priority_rank: 2,
    });

    expect(result[2]).toEqual({
      improvement_item: 'フォローアップ遅延',
      occurrence_count: 2,
      occurrence_rate: 13.3,
      priority_rank: 3,
    });

    const sum_occurrence_count =
      result[0].occurrence_count +
      result[1].occurrence_count +
      result[2].occurrence_count;
    expect(sum_occurrence_count).toBe(total_patterns);

    const sum_occurrence_rate =
      result[0].occurrence_rate +
      result[1].occurrence_rate +
      result[2].occurrence_rate;
    expect(sum_occurrence_rate).toBeCloseTo(100, 1);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].occurrence_count).toBeGreaterThanOrEqual(
        result[i + 1].occurrence_count
      );
    }

    for (let i = 0; i < result.length; i++) {
      expect(result[i].priority_rank).toBe(i + 1);
    }
  });
});