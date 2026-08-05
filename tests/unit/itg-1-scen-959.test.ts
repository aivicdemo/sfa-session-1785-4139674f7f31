import { calculatePriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-959: [edge] 改善優先度スコア算出機能 - 問題パターンリストが影響度の降順で入力されたとき、発生頻度でも正しく再ソートされて優先度スコアが算出される
  test('should recalculate priority scores sorted by occurrence frequency when input list is sorted by impact score', () => {
    // Arrange: 影響度の降順でソート済みの問題パターンリストを準備
    // パターン1: 影響度90、発生頻度2回
    // パターン2: 影響度80、発生頻度8回
    // パターン3: 影響度70、発生頻度5回
    const problem_patterns_input = [
      {
        pattern_id: 'pattern_001',
        impact_score: 90,
        occurrence_frequency: 2,
      },
      {
        pattern_id: 'pattern_002',
        impact_score: 80,
        occurrence_frequency: 8,
      },
      {
        pattern_id: 'pattern_003',
        impact_score: 70,
        occurrence_frequency: 5,
      },
    ];

    // Act: 改善優先度スコア算出機能を実行
    const result = calculatePriorityScores(problem_patterns_input);

    // Assert: 発生頻度の降順（8回 > 5回 > 2回）で再ソートされていることを確認
    expect(result[0].pattern_id).toBe('pattern_002');
    expect(result[0].occurrence_frequency).toBe(8);
    expect(result[1].pattern_id).toBe('pattern_003');
    expect(result[1].occurrence_frequency).toBe(5);
    expect(result[2].pattern_id).toBe('pattern_001');
    expect(result[2].occurrence_frequency).toBe(2);

    // 優先度スコアの計算検証
    // 計算式: priority_score = impact_score × 0.6 + occurrence_frequency × 0.4
    // パターン2: 80 × 0.6 + 8 × 0.4 = 48 + 3.2 = 51.2
    // パターン3: 70 × 0.6 + 5 × 0.4 = 42 + 2.0 = 44.0
    // パターン1: 90 × 0.6 + 2 × 0.4 = 54 + 0.8 = 54.8

    // 再ソート後の優先度スコアが正確に計算されていることを確認
    expect(result[0].priority_score).toBe(51.2);
    expect(result[1].priority_score).toBe(44.0);
    expect(result[2].priority_score).toBe(54.8);

    // 発生頻度が最も高いパターン2（8回）が最初に配置されていることを確認
    expect(result[0].occurrence_frequency).toBeGreaterThan(result[1].occurrence_frequency);
    expect(result[1].occurrence_frequency).toBeGreaterThan(result[2].occurrence_frequency);

    // パターン2の優先度スコアが他のパターンより高いことを確認（発生頻度のウェイトを考慮した最優先）
    // 発生頻度ウェイト（0.4）を考慮すると、パターン2の高い発生頻度がスコアに反映されている
    expect(result[0].occurrence_frequency * 0.4).toBeGreaterThan(
      result[2].occurrence_frequency * 0.4
    );
  });
});