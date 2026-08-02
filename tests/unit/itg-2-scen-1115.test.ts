import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1115
  test('事例データの電話番号形式が不正である場合、形式検証に不合格となる', () => {
    const caseData = {
      phone_number: 'abc-defg-hijk',
    };

    const result = validate(caseData);

    expect(result.status).toBe('FAILED');
    expect(result.error_type).toBe('INVALID_PHONE_FORMAT');
    expect(result.error_message).toContain('電話番号の形式が不正です。期待形式: 09X-XXXX-XXXX');
  });
});