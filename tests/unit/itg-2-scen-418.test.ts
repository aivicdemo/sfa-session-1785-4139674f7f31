import { validateCustomerDataForMonthStart } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-418
  test('[normal] 月初の顧客データ入力漏れが検出される', () => {
    const customer_data_with_missing_id = {
      row_number: 1,
      customer_id: '',
      customer_name: 'ABC Corporation',
      contact_phone: '09012345678',
      check_date: new Date('2024-04-01T00:00:00Z'),
    };

    const customer_data_with_missing_name = {
      row_number: 2,
      customer_id: 'CUST002',
      customer_name: '',
      contact_phone: '09087654321',
      check_date: new Date('2024-04-01T00:00:00Z'),
    };

    const customer_data_with_missing_phone = {
      row_number: 3,
      customer_id: 'CUST003',
      customer_name: 'XYZ Ltd',
      contact_phone: '',
      check_date: new Date('2024-04-01T00:00:00Z'),
    };

    const result = validateCustomerDataForMonthStart([
      customer_data_with_missing_id,
      customer_data_with_missing_name,
      customer_data_with_missing_phone,
    ]);

    expect(result.is_valid).toBe(false);
    expect(result.errors).toHaveLength(3);

    expect(result.errors[0]).toEqual({
      error_code: 'MISSING_REQUIRED_FIELD',
      error_message: '顧客ID',
      row_number: 1,
    });

    expect(result.errors[1]).toEqual({
      error_code: 'MISSING_REQUIRED_FIELD',
      error_message: '顧客名',
      row_number: 2,
    });

    expect(result.errors[2]).toEqual({
      error_code: 'MISSING_REQUIRED_FIELD',
      error_message: '連絡先電話番号',
      row_number: 3,
    });
  });
});