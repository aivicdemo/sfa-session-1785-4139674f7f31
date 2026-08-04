import { calculateDataQualityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-524: [edge] データ品質スコア算出機能 - エラー率が上限100%未満のときスコアが0を上回る
  test('エラー率99%のとき、データ品質スコアは0より大きい値を返す', () => {
    const testDataset = {
      totalRecords: 100,
      errorCount: 99,
      errorRate: 0.99,
    };

    const score = calculateDataQualityScore(testDataset);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1.0);
  });
});