import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 顧客情報入力検証', () => {
  // SCEN-644
  test('顧客名が空文字列のとき、修正を促すエラーメッセージを返す', () => {
    const input_customer_name = '';
    const input_industry = '製造業';
    const input_company_size = 'large';

    const result = validateCustomerInput({
      customer_name: input_customer_name,
      industry: input_industry,
      company_size: input_company_size,
    });

    expect(result.is_valid).toBe(false);
    expect(result.error_message).toBe('顧客名は必須項目です。入力してください');
    expect(result.invalid_field).toBe('customer_name');
    expect(result.should_highlight).toBe(true);
  });
});