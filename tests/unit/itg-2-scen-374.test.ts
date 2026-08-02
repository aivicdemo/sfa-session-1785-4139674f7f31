import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-374
  test('入力漏れが必須項目複数の場合、全項目の不足として報告される', () => {
    const requiredFields = ['顧客名', '売上金額', '営業担当者'];
    const salesDataRecord = {
      顧客名: '',
      売上金額: null,
      営業担当者: '',
    };

    const validationResult = validateSalesData(salesDataRecord, requiredFields);

    expect(validationResult.status).toBe('NG');
    expect(validationResult.missingFields).toEqual(['顧客名', '売上金額', '営業担当者']);
    expect(validationResult.errorMessage).toBe('3個の必須項目が不足しています');
  });
});