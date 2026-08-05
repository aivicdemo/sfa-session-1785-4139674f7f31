import { aggregateUnderstandingScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1004
  test('理解度確認テスト提出が1件の場合、該当営業担当者のスコアが正しく集計される', () => {
    const test_submission_data = [
      {
        employee_id: 'EMP001',
        test_score: 85,
        submission_date: '2024-01-15T10:00:00Z',
      },
    ];

    const result = aggregateUnderstandingScores(test_submission_data);

    expect(result).toEqual({
      employee_id: 'EMP001',
      understanding_score: 85,
      submission_count: 1,
      average_score: 85,
    });
  });
});