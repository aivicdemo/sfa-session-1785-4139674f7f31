import { detectAndMergeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-165
  test('マージ対象レコードが0件のとき、統合処理がスキップされる', () => {
    const mockCustomerRecords = [
      {
        customer_id: 'C001',
        customer_name: '企業A',
        customer_name_kana: 'キギョウエー',
        postal_code: '100-0001',
        address: '東京都千代田区丸の内1-1-1',
        phone_number: '03-1234-5678',
        email: 'contact@company-a.com',
        registration_date: '2024-01-15T10:00:00Z',
        last_updated: '2024-01-15T10:00:00Z',
        created_at: new Date('2024-01-15T10:00:00Z'),
        updated_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        customer_id: 'C002',
        customer_name: '企業B',
        customer_name_kana: 'キギョウビー',
        postal_code: '200-0002',
        address: '神奈川県横浜市中区本町2-2-2',
        phone_number: '045-1234-5678',
        email: 'contact@company-b.com',
        registration_date: '2024-01-16T10:00:00Z',
        last_updated: '2024-01-16T10:00:00Z',
        created_at: new Date('2024-01-16T10:00:00Z'),
        updated_at: new Date('2024-01-16T10:00:00Z'),
      },
    ];

    const duplicateCandidates = [];

    const recordCountBefore = mockCustomerRecords.length;
    const timestampsBefore = mockCustomerRecords.map((r) => r.last_updated);

    const result = detectAndMergeDuplicateCustomers({
      customer_records: mockCustomerRecords,
      duplicate_candidates: duplicateCandidates,
      merge_execution_enabled: true,
    });

    expect(result.merge_skipped).toBe(true);
    expect(result.merged_customer_count).toBe(0);
    expect(result.merge_log_message).toMatch(/マージ対象レコードなし/);

    const recordCountAfter = mockCustomerRecords.length;
    const timestampsAfter = mockCustomerRecords.map((r) => r.last_updated);

    expect(recordCountAfter).toBe(recordCountBefore);
    expect(timestampsAfter).toEqual(timestampsBefore);
  });
});