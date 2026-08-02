import { validatePhoneNumberFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1158
  test('電話番号形式が不正な顧客データに対して検証を実行した場合、データ形式エラーが検出される', () => {
    const invalidPhoneNumbers = [
      'abc-defg-hijk',
      '123',
      '090-1234',
    ];

    invalidPhoneNumbers.forEach((phoneNumber) => {
      const customerData = {
        phoneNumber,
      };

      const validationResult = validatePhoneNumberFormat(customerData);

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorType).toBe('DATA_FORMAT_ERROR');
      expect(validationResult.fieldName).toBe('phoneNumber');
      expect(validationResult.message).toBe('電話番号の形式が正しくありません');
      expect(validationResult.errorCode).toBe('PHONE_FORMAT_INVALID');
    });
  });
});