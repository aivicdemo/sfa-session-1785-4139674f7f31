import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-432
  test('反応内容が空文字列のとき、エラーが発生する', () => {
    const customer_id = 'CUST-20240115-001';
    const record_datetime = new Date('2024-01-15T11:00:00Z');
    const reaction_content = '';
    const reaction_category = 'email_reply';

    expect(() =>
      recordCustomerReaction({
        customer_id,
        record_datetime,
        reaction_content,
        reaction_category,
      })
    ).toThrow(/反応内容/);
  });
});