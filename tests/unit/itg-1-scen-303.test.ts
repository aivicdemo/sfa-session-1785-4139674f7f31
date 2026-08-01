import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-303
  test('顧客反応記録・標準化機能 - 反応記録日時が欠落している場合エラーが発生する', () => {
    const invalidPayloadMissingDateTime = {
      customerId: 'CUST001',
      reactionDateTime: null,
      reactionType: 'EMAIL_REPLY',
      reactionContent: 'Interested in the proposal'
    };

    expect(() => recordCustomerReaction(invalidPayloadMissingDateTime)).toThrow(/反応記録日時は必須項目です/);
  });
});