import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-310
  test('反応記録日時が現在日時より未来の場合はバリデーションエラーを発生させる', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    const futureDateTime = new Date('2024-01-15T11:00:00Z');

    const input = {
      customerId: 'CUST001',
      reactionContent: 'メール返信あり',
      reactionDateTime: futureDateTime,
      currentDateTime: now,
    };

    expect(() => recordCustomerReaction(input)).toThrow(/反応記録日時/);
  });
});