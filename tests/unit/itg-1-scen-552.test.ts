import { extractProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-552
  test('[error] 対応すべき問題の抽出機能 - 問題検出結果が入力されない場合、処理が失敗する', () => {
    const input = {
      detectionResult: null,
      problemClassificationRules: {
        severityLevels: ['critical', 'high', 'medium', 'low'],
        priorityFactors: ['frequency', 'impact', 'affectedUsers'],
      },
    };

    expect(() => extractProblems(input)).toThrow(/問題検出結果/);
  });
});