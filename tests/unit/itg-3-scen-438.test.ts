import { evaluateDataQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 顧客マスタ品質評価', () => {
  // SCEN-438
  test('顧客マスタのエラー件数が0件の場合、該当カテゴリのスコアが満点で算出される', () => {
    const testCustomerId = 'CUST-TEST-001';
    const errorCount = 0;
    const category = '顧客基本情報';
    const expectedScoreValue = 100;

    const qualityInput = {
      customerId: testCustomerId,
      errorCount: errorCount,
      category: category,
    };

    const result = evaluateDataQuality(qualityInput);

    expect(result.scoreValue).toBe(expectedScoreValue);
    expect(result.category).toBe(category);
    expect(result.errorCount).toBe(0);
  });
});