import { standardizeCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-431
  test('反応内容が null のとき、エラーが発生する', () => {
    const input = {
      customerId: 'CUST-12345',
      reactionDateTime: new Date('2024-01-15T10:30:00Z'),
      reactionCategory: '提案承認',
      reactionContent: null,
    };

    expect(() => standardizeCustomerReaction(input)).toThrow(/反応内容/);
  });
});