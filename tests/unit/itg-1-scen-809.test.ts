import { classifyProblemsByImportanceAndPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-809
  test('複数の問題が同じ重要度スコアで重複している場合、すべてが同一優先度に分類される', () => {
    const problem_a = {
      problem_id: 'prob_001',
      importance_score: 80,
      description: 'プロセス遵守率が目標値を下回る',
      detection_timestamp: new Date('2024-01-15T10:00:00Z'),
    };

    const problem_b = {
      problem_id: 'prob_002',
      importance_score: 80,
      description: 'データ品質スコアが低下している',
      detection_timestamp: new Date('2024-01-15T10:05:00Z'),
    };

    const problem_c = {
      problem_id: 'prob_003',
      importance_score: 80,
      description: 'AIエージェント推論精度が基準未満',
      detection_timestamp: new Date('2024-01-15T10:10:00Z'),
    };

    const problems = [problem_a, problem_b, problem_c];

    const classification_result = classifyProblemsByImportanceAndPriority(problems);

    expect(classification_result).toHaveLength(3);
    expect(classification_result[0].priority_level).toBe(2);
    expect(classification_result[1].priority_level).toBe(2);
    expect(classification_result[2].priority_level).toBe(2);
    expect(classification_result[0].priority_level).toEqual(classification_result[1].priority_level);
    expect(classification_result[1].priority_level).toEqual(classification_result[2].priority_level);
  });
});