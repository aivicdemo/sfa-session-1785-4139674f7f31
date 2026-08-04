import { validateCustomerInformation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-595
  test('[normal] 顧客情報入力フォーム検証機能 - 企業規模の値が形式に適合しないとき不備として指摘される', () => {
    const invalidCompanySize = '@#$%';
    
    const result = validateCustomerInformation({
      companySize: invalidCompanySize,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        field: 'companySize',
        message: expect.stringMatching(/企業規模/),
      })
    );
    expect(result.canSubmit).toBe(false);
  });
});