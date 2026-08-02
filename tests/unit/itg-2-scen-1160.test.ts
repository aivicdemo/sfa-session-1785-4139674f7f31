import { validateCustomerDataWithRule } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1160
  test('データ品質ルール1件を適用して顧客データを検証した場合、当該ルールの検証結果が返される', () => {
    const rule = {
      ruleId: 'RULE_CUSTOMER_NAME_REQUIRED_AND_LENGTH',
      ruleName: '顧客名は必須かつ50文字以内',
      targetField: 'customerName',
      constraints: [
        {
          type: 'required',
          message: '顧客名は必須です',
        },
        {
          type: 'maxLength',
          value: 50,
          message: '顧客名は50文字以内です',
        },
      ],
    };

    const testCustomerData = {
      customerId: 'C001',
      customerName: '山田太郎',
      email: 'yamada@example.com',
    };

    const result = validateCustomerDataWithRule(rule, testCustomerData);

    expect(result).toEqual({
      ruleId: 'RULE_CUSTOMER_NAME_REQUIRED_AND_LENGTH',
      ruleName: '顧客名は必須かつ50文字以内',
      status: 'PASS',
      targetField: 'customerName',
      validatedValue: '山田太郎',
      message: '検証に成功しました',
    });
  });
});