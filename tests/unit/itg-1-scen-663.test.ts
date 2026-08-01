import { calculatePriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-663: [normal] 改善優先度スコア算出機能 - 問題パターン複数件のとき全件について優先度スコアが計算される
  test('should calculate priority scores for all problem patterns when multiple patterns are provided', () => {
    const input_problem_patterns = [
      {
        pattern_id: 'pattern_001',
        pattern_name: '営業プロセス違反',
        importance: 5,
        occurrence_frequency: 3,
        impact_level: 4,
      },
      {
        pattern_id: 'pattern_002',
        pattern_name: '顧客対応遅延',
        importance: 4,
        occurrence_frequency: 5,
        impact_level: 3,
      },
      {
        pattern_id: 'pattern_003',
        pattern_name: '見積精度低下',
        importance: 3,
        occurrence_frequency: 2,
        impact_level: 5,
      },
    ];

    const result = calculatePriorityScores(input_problem_patterns);

    expect(result.calculated_count).toBe(3);
    expect(result.priority_scores).toHaveLength(3);

    expect(result.priority_scores[0]).toEqual({
      pattern_id: 'pattern_001',
      pattern_name: '営業プロセス違反',
      priority_score: 60,
      calculation_status: '完了',
    });

    expect(result.priority_scores[1]).toEqual({
      pattern_id: 'pattern_002',
      pattern_name: '顧客対応遅延',
      priority_score: 60,
      calculation_status: '完了',
    });

    expect(result.priority_scores[2]).toEqual({
      pattern_id: 'pattern_003',
      pattern_name: '見積精度低下',
      priority_score: 30,
      calculation_status: '完了',
    });

    expect(result.overall_status).toBe('完了');
  });
});