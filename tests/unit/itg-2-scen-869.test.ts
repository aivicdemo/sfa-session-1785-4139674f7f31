import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-869
  test('正規化ルールが1件のとき、該当ルールが適用される', () => {
    const normalizationRules = [
      {
        rule_id: 'RULE_001',
        rule_name: '顧客名前処理',
        source_pattern: '（株）',
        target_value: '株式会社',
        priority: 1,
        active_flag: true
      }
    ];

    const customerData = {
      customer_id: 'CUST_12345',
      customer_name: '（株）テスト会社',
      furigana_name: 'テストガイシャ',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内',
      phone_number: '03-1234-5678',
      email: 'test@example.com',
      industry_code: 'IND_001',
      employee_count: 50,
      establishment_date: '2010-05-15',
      representative_name: '山田太郎',
      business_description: 'IT系コンサルティング',
      sales_status: 'active',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    };

    const result = applyNormalizationRules(customerData, normalizationRules);

    expect(result.customer_name).toBe('株式会社テスト会社');
    expect(result.customer_id).toBe('CUST_12345');
    expect(result.postal_code).toBe('100-0001');
    expect(result.address).toBe('東京都千代田区丸の内');
  });
});