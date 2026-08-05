import { classifyAndPrioritizeProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-797
  test('問題検出結果の分類・優先度付け機能 - 営業プロセス定義が存在しない場合、エラーになる', () => {
    const problemDetectionResult = {
      problemId: 'PRB-001',
      category: '提案遅延',
      severity: 'high',
      detectedAt: new Date('2024-01-15T11:00:00Z'),
    };

    const processDefinitions = [];

    expect(() => {
      classifyAndPrioritizeProblems(problemDetectionResult, processDefinitions);
    }).toThrow(/営業プロセス定義/);
  });
});