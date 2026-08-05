import { validateProblemClassification } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-799
  test('重要度が高く優先度が低い場合、業務ルール違反エラーが発生する', () => {
    const invalid_input = {
      problem_id: 'prob_001',
      severity: 'high',
      priority: 'low',
      description: 'Test problem',
      detected_at: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() => validateProblemClassification(invalid_input)).toThrow(/重要度/);
  });
});