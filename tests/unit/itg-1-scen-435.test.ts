import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-435
  test('反応記録タイムスタンプが未来の日時のとき、エラーが発生する', () => {
    const now = new Date('2024-01-15T11:00:00Z');
    const futureTimestamp = new Date('2024-01-16T11:00:00Z');

    const customer_reaction_record = {
      reaction_id: 'react_001',
      deal_id: 'deal_001',
      customer_id: 'cust_001',
      reaction_timestamp: futureTimestamp,
      reaction_type: 'email_reply',
      reaction_content: 'Interested in proposal',
      recorded_at: now,
    };

    expect(() => recordCustomerReaction(customer_reaction_record)).toThrow(
      /INVALID_FUTURE_TIMESTAMP/
    );
  });
});