import { validatePhoneNumberFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1114
  test('[normal] 事例データの電話番号形式が正しい場合、形式検証に合格する', () => {
    const phoneNumber = '090-1234-5678';
    
    const result = validatePhoneNumberFormat(phoneNumber);
    
    expect(result.isValid).toBe(true);
    expect(result.status).toBe('VALID_FORMAT');
    expect(result.errorCode).toBeUndefined();
  });
});