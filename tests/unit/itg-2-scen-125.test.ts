import { mergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-125
  test('統合判定結果のタイムスタンプが正確に記録される', () => {
    const fixed_timestamp = '2024-01-15T10:30:45.123Z';
    const customer_1 = {
      customer_id: 'A001',
      customer_name: '株式会社テスト1',
      address: '東京都渋谷区',
      phone: '03-1234-5678',
    };
    const customer_2 = {
      customer_id: 'A002',
      customer_name: '株式会社テスト1',
      address: '東京都渋谷区',
      phone: '03-1234-5678',
    };

    const result = mergeCustomerDuplicates(
      [customer_1, customer_2],
      () => fixed_timestamp
    );

    expect(result.timestamp).toBe('2024-01-15T10:30:45.123Z');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});