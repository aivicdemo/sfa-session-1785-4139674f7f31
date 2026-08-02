import { validateCaseData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1109
  test('事例データの必須フィールドが1つ以上欠けている場合、検証に不合格となる', () => {
    const requiredFields = ['顧客ID', '商品名', '金額', '商談日'];
    
    const caseData = {
      顧客ID: 'CUST-001',
      商品名: 'SaaS基本プラン',
      金額: 150000,
      商談日: null,
    };

    const result = validateCaseData({
      caseData,
      requiredFields,
    });

    expect(result.validationStatus).toBe('FAILED');
    expect(result.errorCode).toBe('MISSING_REQUIRED_FIELD');
    expect(result.missingFields).toEqual(['商談日']);
  });
});