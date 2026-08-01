import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-572: [edge] 優先度スコアの計算機能 - 優先度スコアの計算で端数が発生する場合、正しく丸められる', () => {
    // 入力値
    const customerImportance = 7.5;
    const dealAmount = 1234567.89;
    const closingProbability = 0.633;

    // 関数実行
    const result = calculatePriorityScore({
      customerImportance,
      dealAmount,
      closingProbability,
    });

    // 期待結果: 小数第2位で四捨五入されたスコア
    // 計算例: (7.5 × (1234567.89 / 1000000) × 0.633) の結果を四捨五入
    // = (7.5 × 1.23456789 × 0.633)
    // = 5.874...
    // → 小数第2位で四捨五入: 5.87
    expect(result).toBe(5.87);
    expect(typeof result).toBe('number');
  });
});