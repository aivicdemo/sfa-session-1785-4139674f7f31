import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-155
  test('名寄せ基準の重み付けスコアが閾値直上のとき、重複と判定される', () => {
    const threshold = 85.0;

    const customerA = {
      customer_id: 'CUST001',
      customer_name: '株式会社A',
      postal_code: '100-0001',
      phone_number: '03-1234-5678',
    };

    const customerB = {
      customer_id: 'CUST002',
      customer_name: '株式会社Ａ',
      postal_code: '100-0001',
      phone_number: '03-1234-5678',
    };

    const result = detectDuplicateCustomers({
      customer_records: [customerA, customerB],
      threshold: threshold,
    });

    expect(result.is_duplicate).toBe(true);
    expect(result.merge_status).toBe('MERGE_CANDIDATE');
    expect(result.match_score).toBe(85.0);
  });
});