import { calculateImprovementPriorityScores } from '../../src/logic/it-1-br-target4-1-1-1';

describe('改善優先度スコア算出機能', () => {
  test('SCEN-936: 営業担当者ごとの行動パターン問題から改善優先度スコアが正しく算出される', () => {
    // Arrange
    const behavior_pattern_problems = [
      {
        sales_rep_id: 'A',
        problem_type: '提案資料作成遅延',
        occurrence_count: 5,
        business_impact_weight: 8,
      },
      {
        sales_rep_id: 'B',
        problem_type: '顧客フォローアップ忘れ',
        occurrence_count: 3,
        business_impact_weight: 6,
      },
      {
        sales_rep_id: 'C',
        problem_type: '商談記録漏れ',
        occurrence_count: 2,
        business_impact_weight: 4,
      },
    ];

    // Act
    const result = calculateImprovementPriorityScores(behavior_pattern_problems);

    // Assert
    expect(result).toEqual([
      {
        sales_rep_id: 'A',
        improvement_priority_score: 87,
      },
      {
        sales_rep_id: 'B',
        improvement_priority_score: 65,
      },
      {
        sales_rep_id: 'C',
        improvement_priority_score: 42,
      },
    ]);
  });
});