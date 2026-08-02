import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1132
  test('正規化後の顧客名が一致する場合、重複候補として判定される', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '株式会社　太郎商事',
      address: '東京都渋谷区',
      phone: '03-XXXX-0001',
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '株式会社太郎商事',
      address: '東京都渋谷区',
      phone: '03-XXXX-0002',
    };

    const result = detectAndMergeCustomerDuplicates([recordA, recordB]);

    expect(result.duplicate_pairs).toHaveLength(1);
    expect(result.duplicate_pairs[0]).toEqual({
      record_a_id: 'CUST001',
      record_b_id: 'CUST002',
      normalized_name_a: '株式会社太郎商事',
      normalized_name_b: '株式会社太郎商事',
      duplicate_judgment: '重複候補',
      duplicate_score: expect.any(Number),
    });
    expect(result.duplicate_pairs[0].duplicate_score).toBeGreaterThanOrEqual(0.95);
    expect(result.duplicate_pairs[0].duplicate_score).toBeLessThanOrEqual(1.0);
  });
});