import { evaluateTransactionDataQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業トランザクションデータ品質評価', () => {
  // SCEN-442
  test('営業トランザクションのエラー件数が1件の場合、スコアが正しく減点される', () => {
    const transactionDataset = {
      totalCount: 100,
      errorCount: 1,
      normalCount: 99,
    };

    const baseScore = 100;
    const deductionPerError = 1;
    const expectedScore = baseScore - (transactionDataset.errorCount * deductionPerError);

    const result = evaluateTransactionDataQuality(transactionDataset);

    expect(result.qualityScore).toBe(99);
    expect(result.qualityScore).toBe(expectedScore);
  });
});