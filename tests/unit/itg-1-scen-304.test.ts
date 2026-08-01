import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-304: [error] 顧客反応記録・標準化機能 - 反応内容テキストが空文字列の場合エラーが発生する', () => {
    const input_customer_id = 'CUST-20240515-001';
    const input_reaction_datetime = new Date('2024-05-15T14:30:00Z');
    const input_reaction_type = 'email_response';
    const input_reaction_content = '';

    expect(() =>
      recordCustomerReaction({
        customer_id: input_customer_id,
        reaction_datetime: input_reaction_datetime,
        reaction_type: input_reaction_type,
        reaction_content: input_reaction_content,
      })
    ).toThrow(/反応内容/);
  });
});