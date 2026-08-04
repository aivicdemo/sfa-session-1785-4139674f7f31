import { evaluateDataQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-438
  test('顧客マスタの品質評価機能 - エラー件数0件の場合、該当カテゴリのスコアが満点で算出される', () => {
    const testCustomerData = {
      customerId: 'CUST-TEST-001',
      category: '顧客基本情報',
      errorCount: 0,
    };

    const result = evaluateDataQuality(testCustomerData);

    expect(result.scoreValue).toBe(100);
    expect(result.category).toBe('顧客基本情報');
    expect(result.errorCount).toBe(0);
  });
});