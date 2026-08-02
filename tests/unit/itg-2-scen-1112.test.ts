import { validateEmailFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1112
  test('事例データのメールアドレス形式が正しい場合、形式検証に合格する', () => {
    const testCaseData = {
      email: 'sales@example.com'
    };

    const result = validateEmailFormat(testCaseData);

    expect(result.status).toBe('PASS');
    expect(result.errorMessage).toBe('');
  });
});