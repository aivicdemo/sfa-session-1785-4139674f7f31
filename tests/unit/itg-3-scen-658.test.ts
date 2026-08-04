import { validateCompanySize } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-658
  test('企業規模が定義済みカテゴリ外の値のときバリデーションエラーを返し修正メッセージを提示', () => {
    const invalidCompanySizeValue = '超大規模';
    const customerInfo = {
      companySize: invalidCompanySizeValue,
    };

    const validationResult = validateCompanySize(customerInfo);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.fieldName).toBe('companySize');
    expect(validationResult.errorCode).toBe('INVALID_COMPANY_SIZE_CATEGORY');
    expect(validationResult.message).toBe(
      '企業規模は【大企業 / 中堅企業 / 中小企業 / スタートアップ】から選択してください'
    );
  });
});