import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-384
  test('電話番号が完全一致する場合、重複候補に含められる', () => {
    const customers = [
      {
        customer_id: 'CUST001',
        phone_number: '09012345678',
        company_name: '株式会社ABC',
      },
      {
        customer_id: 'CUST002',
        phone_number: '09012345678',
        company_name: 'ABC株式会社',
      },
    ];

    const result = detectDuplicateCustomers(customers, ['phone_number']);

    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      customer_id_1: 'CUST001',
      customer_id_2: 'CUST002',
      match_reason: '電話番号完全一致（09012345678）',
      duplicate_score: 100,
    });
  });
});