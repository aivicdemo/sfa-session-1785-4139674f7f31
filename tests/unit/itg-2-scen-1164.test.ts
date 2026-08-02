import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1164: 同一メールアドレス・異なる顧客コードの2件データに対して重複判定を実行した場合、重複候補として検出される', () => {
    const input_customer_records = [
      {
        customer_code: 'C001',
        customer_name: 'Example Company A',
        email_address: 'user@example.com',
        phone_number: '03-1234-5678',
        address: 'Tokyo, Japan'
      },
      {
        customer_code: 'C002',
        customer_name: 'Example Corp B',
        email_address: 'user@example.com',
        phone_number: '03-9876-5432',
        address: 'Osaka, Japan'
      }
    ];

    const result = detectDuplicateCustomers(input_customer_records);

    expect(result).toEqual({
      duplicate_candidates: [
        {
          primary_customer_code: 'C001',
          duplicate_customer_code: 'C002',
          match_reason: 'メールアドレス一致',
          confidence_score: expect.any(Number)
        }
      ],
      total_duplicate_count: 1
    });

    expect(result.duplicate_candidates[0].primary_customer_code).toBe('C001');
    expect(result.duplicate_candidates[0].duplicate_customer_code).toBe('C002');
    expect(result.duplicate_candidates[0].match_reason).toBe('メールアドレス一致');
    expect(result.total_duplicate_count).toBe(1);
  });
});