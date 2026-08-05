import { classifyAndPrioritizeProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-790: [error] 問題検出結果の分類・優先度付け機能 - 問題オブジェクトの検出内容が空文字列の場合、エラーになる
  test('should throw error when detectionContent is empty string', () => {
    const invalidProblem = {
      problemId: 'prob-001',
      detectionContent: '',
      severity: 'high',
      frequency: 5,
      impactScope: 'sales_team',
      timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
    };

    expect(() => classifyAndPrioritizeProblems(invalidProblem)).toThrow(/検出内容|detectionContent/);
  });
});