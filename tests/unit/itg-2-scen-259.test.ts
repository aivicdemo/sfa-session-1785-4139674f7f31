import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-259
  test('顧客マスタが複数件のとき、重複候補が正常に検出される', () => {
    const customers = [
      {
        customer_id: 'C001',
        name: '山田太郎',
        email: 'yamada@example.com',
      },
      {
        customer_id: 'C002',
        name: '山田太郎',
        email: 'yamada.taro@example.com',
      },
      {
        customer_id: 'C003',
        name: '佐藤次郎',
        email: 'sato@example.com',
      },
    ];

    const threshold = 0.85;

    const result = detectDuplicateCustomers(customers, threshold);

    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      customer_id_1: 'C001',
      customer_id_2: 'C002',
      name_similarity: 0.95,
      email_similarity: 0.80,
      overall_similarity_score: 0.88,
    });
  });
});