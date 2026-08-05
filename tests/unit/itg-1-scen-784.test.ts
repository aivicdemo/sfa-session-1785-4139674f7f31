import { classifyAndPrioritizeDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-784
  test('[error] 問題検出結果の分類・優先度付け機能 - 検出された問題リストがnullの場合、処理がエラーになる', () => {
    expect(() => {
      classifyAndPrioritizeDetectedProblems(null);
    }).toThrow(/問題リスト/);
  });
});