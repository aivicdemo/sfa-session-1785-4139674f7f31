import { calculateComprehensionScores } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-722
  test('成功パターン適用ガイドラインの周知完了判定機能 - 理解度確認テストを提出した営業担当者の理解度スコアが正しく集計される', () => {
    const test_input = {
      sales_staff: [
        {
          staff_id: 'staff_001',
          staff_name: 'A',
          correct_answers: 2,
          total_questions: 3,
        },
        {
          staff_id: 'staff_002',
          staff_name: 'B',
          correct_answers: 3,
          total_questions: 3,
        },
        {
          staff_id: 'staff_003',
          staff_name: 'C',
          correct_answers: 1,
          total_questions: 3,
        },
      ],
      threshold_percentage: 70,
    };

    const result = calculateComprehensionScores(test_input);

    expect(result.scores).toEqual([
      {
        staff_id: 'staff_001',
        staff_name: 'A',
        score: 67,
        percentage: 66.7,
      },
      {
        staff_id: 'staff_002',
        staff_name: 'B',
        score: 100,
        percentage: 100,
      },
      {
        staff_id: 'staff_003',
        staff_name: 'C',
        score: 33,
        percentage: 33.3,
      },
    ]);

    expect(result.team_average_percentage).toBe(66.7);
    expect(result.completion_achieved_count).toBe(1);
    expect(result.completion_status).toBe('pending');
  });
});