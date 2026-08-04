import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-744
  test('顧客データ完全性・妥当性判定機能 - 必須項目である業種が空文字列のとき、推奨生成不可と判定される', () => {
    const customerData = {
      company_name: 'テスト企業',
      industry: '',
      company_size: '中堅企業',
      representative_name: '営業太郎',
      representative_email: 'sales.taro@example.com',
      contact_phone: '03-1234-5678',
    };

    expect(() => validateCustomerDataCompleteness(customerData)).toThrow(/業種/);
  });
});