import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化', () => {
  // SCEN-1043
  test('顧客データの住所が欠けている場合に重複判定エラーとして処理される', () => {
    const customer_record_1 = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      address: '',
    };

    const customer_record_2 = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      address: '',
    };

    const input_records = [customer_record_1, customer_record_2];

    expect(() => detectDuplicateCustomers(input_records)).toThrow(/ADDRESS_MISSING_FOR_DUPLICATE_CHECK/);
  });
});