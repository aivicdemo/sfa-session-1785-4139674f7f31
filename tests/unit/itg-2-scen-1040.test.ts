import { detectDuplicateCandidates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化', () => {
  // SCEN-1040
  test('重複候補検出時に比較対象となる顧客データが0件の場合に重複候補が検出されない', () => {
    const inputCustomer = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const existingCustomers: typeof inputCustomer[] = [];

    const result = detectDuplicateCandidates(inputCustomer, existingCustomers);

    expect(result).toEqual({
      duplicate_candidates_count: 0,
      duplicates: [],
      is_new_customer: true,
      error: null,
    });
  });
});