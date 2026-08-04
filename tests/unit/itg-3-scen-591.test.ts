import { validateCustomerInputForm } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客情報入力フォーム検証機能', () => {
  // SCEN-591
  test('必須項目をすべて満たし形式が正しい入力データが受け付けられ送信準備完了状態になる', () => {
    const input = {
      customerName: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
      industry: '製造業',
      companySize: '100-500名',
      budget: '500万円以上',
    };

    const result = validateCustomerInputForm(input);

    expect(result.isValid).toBe(true);
    expect(result.submitButtonDisabled).toBe(false);
    expect(result.errorMessages).toEqual([]);
    expect(result.readyForSubmission).toBe(true);
  });
});