import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-139: メールアドレスが空文字列のレコードは検査対象外に除外される', () => {
    const customerDataset = [
      {
        customer_id: 'CUST001',
        customer_name: '太郎商事',
        email: '',
        phone: '090-1111-1111',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST002',
        customer_name: '花子株式会社',
        email: '',
        phone: '090-2222-2222',
        address: '東京都新宿区',
      },
      {
        customer_id: 'CUST003',
        customer_name: '次郎ビジネス',
        email: '',
        phone: '090-3333-3333',
        address: '神奈川県横浜市',
      },
      {
        customer_id: 'CUST004',
        customer_name: 'ABC商社',
        email: 'abc@example.com',
        phone: '090-4444-4444',
        address: '東京都港区',
      },
      {
        customer_id: 'CUST005',
        customer_name: 'XYZ工業',
        email: 'xyz@example.com',
        phone: '090-5555-5555',
        address: '大阪府大阪市',
      },
    ];

    const result = detectDuplicateCustomersAndJudgeIntegration(customerDataset);

    expect(result.inspection_target_record_count).toBe(2);
    expect(result.excluded_empty_email_count).toBe(3);
    expect(result.inspection_target_records.length).toBe(2);
    expect(result.inspection_target_records.every((record) => record.email !== '')).toBe(
      true,
    );
  });
});