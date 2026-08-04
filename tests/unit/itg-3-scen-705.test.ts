import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント顧客データ完全性・妥当性判定機能', () => {
  // SCEN-705
  test('業種が営業マスタの定義済み業種リストに含まれるとき、業種データは妥当と判定される', () => {
    const validIndustries = ['製造業', '卸売業', '小売業', '情報通信業', '金融保険業'];
    
    const customerData = {
      customerId: 'CUST-001',
      customerName: 'テスト製造会社',
      industry: '製造業',
      address: '東京都渋谷区1-1-1',
      phone: '03-0000-0000',
      companySize: 'large'
    };

    const result = validateCustomerDataCompleteness(customerData, validIndustries);

    expect(result).toEqual({
      isValid: true,
      fieldValidation: {
        industry: {
          isValid: true,
          message: null
        }
      },
      overallStatus: 'VALID'
    });
  });
});