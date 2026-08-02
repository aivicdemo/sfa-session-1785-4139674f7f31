import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1110
  test('事例データの必須フィールドが空文字列である場合、検証に不合格となる', () => {
    const case_data_empty_customer_name = {
      customer_name: '',
      project_amount: '1000000',
      contract_date: '2024-01-15'
    };

    const result = validate(case_data_empty_customer_name);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(result.errors.some(
      (err: { field: string; message: string }) =>
        err.field === 'customer_name' && err.message.includes('必須フィールドが空です')
    )).toBe(true);
  });
});