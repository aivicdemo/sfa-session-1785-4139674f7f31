import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-379
  test('同一顧客名かつ同一電話番号の顧客が1組の場合、その1組が重複候補として返される', () => {
    const customerA = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'yamada.taro@example.com',
      address: '東京都渋谷区',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const customerB = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'yamada.taro.b@example.com',
      address: '東京都渋谷区',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const customerC = {
      customer_id: 'CUST003',
      customer_name: '鈴木次郎',
      phone_number: '090-9876-5432',
      email: 'suzuki.jiro@example.com',
      address: '東京都新宿区',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    };

    const customers = [customerA, customerB, customerC];

    const result = detectDuplicateCustomers(customers);

    expect(result).toEqual(
      expect.objectContaining({
        duplicate_candidates_count: 1,
        duplicate_candidates: expect.arrayContaining([
          expect.objectContaining({
            customer_id_1: expect.any(String),
            customer_id_2: expect.any(String),
            match_reason: '顧客名一致かつ電話番号一致',
            confidence_score: expect.any(Number),
          }),
        ]),
      })
    );

    const duplicatePair = result.duplicate_candidates[0];
    const ids = [duplicatePair.customer_id_1, duplicatePair.customer_id_2].sort();
    expect(ids).toEqual(['CUST001', 'CUST002']);
    expect(duplicatePair.match_reason).toBe('顧客名一致かつ電話番号一致');
  });
});