import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1163
  test('同一顧客名・異なる顧客コードの2件データに対して重複判定を実行した場合、重複候補として検出される', () => {
    const customer_record_1 = {
      customer_id: 'CUST-001',
      customer_name: '株式会社ABC',
      address: '東京都渋谷区',
      phone: '03-1234-5678',
    };

    const customer_record_2 = {
      customer_id: 'CUST-002',
      customer_name: '株式会社ABC',
      address: '東京都渋谷区',
      phone: '03-1234-5678',
    };

    const result = detectDuplicateCustomers([customer_record_1, customer_record_2]);

    expect(result).toEqual({
      is_duplicate_detected: true,
      duplicate_candidates: [
        {
          customer_id_1: 'CUST-001',
          customer_id_2: 'CUST-002',
          customer_name: '株式会社ABC',
          duplicate_type: '同一顧客名・異なる顧客コード',
          confidence_score: expect.any(Number),
        },
      ],
    });

    expect(result.is_duplicate_detected).toBe(true);
    expect(result.duplicate_candidates.length).toBe(1);
    expect(result.duplicate_candidates[0].customer_name).toBe('株式会社ABC');
    expect(result.duplicate_candidates[0].customer_id_1).toBe('CUST-001');
    expect(result.duplicate_candidates[0].customer_id_2).toBe('CUST-002');
    expect(result.duplicate_candidates[0].duplicate_type).toBe('同一顧客名・異なる顧客コード');
    expect(result.duplicate_candidates[0].confidence_score).toBeGreaterThan(0);
    expect(result.duplicate_candidates[0].confidence_score).toBeLessThanOrEqual(1);
  });
});