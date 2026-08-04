import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-648
  test('顧客名が業務上の最大文字数ちょうどのとき、入力受け付けが完了する', () => {
    const maxLength = 100;
    const customerName = 'あ'.repeat(maxLength);
    const customerInput = {
      name: customerName,
      industry: '製造業',
      scale: '大企業'
    };

    const result = validateCustomerInput(customerInput);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.acceptedInput).toEqual({
      name: customerName,
      industry: '製造業',
      scale: '大企業'
    });
  });
});