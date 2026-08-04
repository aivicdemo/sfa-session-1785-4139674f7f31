import { validateCustomerInfoInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-662
  test('業種にのみ形式エラーがあるとき、業種のみ修正を促す', () => {
    const input = {
      customerName: '山田太郎',
      emailAddress: 'yamada@example.com',
      industry: '製造業#',
      salesScale: '1000万円以上'
    };

    const result = validateCustomerInfoInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      customerName: undefined,
      emailAddress: undefined,
      industry: '業種の形式が正しくありません。全角文字と数字のみで入力してください',
      salesScale: undefined
    });
    expect(result.invalidFields).toEqual(['industry']);
    expect(result.highlightedField).toBe('industry');
    expect(result.shouldSubmit).toBe(false);
  });
});