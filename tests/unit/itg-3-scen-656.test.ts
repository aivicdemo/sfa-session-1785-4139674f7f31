import { validateCustomerIndustry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-656
  test('業種が定義済みマスタ値に含まれないとき、該当項目の修正を促す', () => {
    const definedIndustries = [
      '製造業',
      '小売業',
      'サービス業',
      '金融業',
    ];

    const inputIndustry = 'XX業';

    const validationResult = validateCustomerIndustry(inputIndustry, definedIndustries);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorMessage).toMatch(/業種/);
    expect(validationResult.suggestedValues).toEqual(definedIndustries);
    expect(validationResult.fieldStatus).toBe('warning');
    expect(validationResult.isFormSubmitEnabled).toBe(false);
  });
});