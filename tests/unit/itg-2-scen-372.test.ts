import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-372
  test('入力漏れが0件の場合、入力漏れエラーは報告されない', () => {
    const validationRules = [
      { fieldName: 'customerId', required: true, type: 'string' },
      { fieldName: 'customerName', required: true, type: 'string' },
      { fieldName: 'email', required: true, type: 'string' },
      { fieldName: 'phoneNumber', required: true, type: 'string' },
      { fieldName: 'address', required: true, type: 'string' },
      { fieldName: 'industry', required: true, type: 'string' },
      { fieldName: 'salesStage', required: true, type: 'string' },
    ];

    const salesData = {
      customerId: 'CUST-001',
      customerName: '山田商事',
      email: 'info@yamada.co.jp',
      phoneNumber: '03-1234-5678',
      address: '東京都渋谷区',
      industry: '製造業',
      salesStage: '提案段階',
    };

    const result = validate(salesData, validationRules);

    const inputMissingErrors = result.errors.filter(
      (error) => error.errorType === 'INPUT_MISSING'
    );

    expect(inputMissingErrors.length).toBe(0);
  });
});