import { describe, test, expect } from '@jest/globals';
import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-616
  test('[error] 顧客情報入力検証機能 - 顧客名が空のとき、必須項目不足エラーを返す', () => {
    const customerInfo = {
      customerName: '',
      email: 'test@example.com',
      phoneNumber: '09012345678'
    };

    const result = validateCustomerInfo(customerInfo);

    expect(result).toEqual({
      isValid: false,
      errorCode: 'REQUIRED_FIELD_MISSING',
      errorMessage: '顧客名は必須項目です',
      fieldName: 'customerName'
    });
  });
});