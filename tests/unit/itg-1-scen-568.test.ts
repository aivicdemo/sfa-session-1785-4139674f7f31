import { calculateImportanceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-568
  test('重要度スコアの計算機能 - 重要度スコアが最大値100になる場合、100として計算される', () => {
    const input_importance_score = 100;
    const result = calculateImportanceScore(input_importance_score);
    expect(result).toBe(100);
  });
});