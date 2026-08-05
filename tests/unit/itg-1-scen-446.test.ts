import { recordCustomerReaction, getCustomerReactionsByTimestamp } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類記録機能', () => {
  // SCEN-446
  test('複数の顧客反応を時系列で処理するとき逆順で入力されると記録順序が反転する', () => {
    const customer_id = 'CUST001';
    const contact_id = 'CONT001';

    // 顧客反応1: 2024-01-15 10:00:00、分類: 前向き
    const reaction_1 = {
      timestamp: new Date('2024-01-15T10:00:00Z'),
      classification: '前向き',
      content: '提案に興味あり',
    };

    // 顧客反応2: 2024-01-15 10:15:00、分類: 中立
    const reaction_2 = {
      timestamp: new Date('2024-01-15T10:15:00Z'),
      classification: '中立',
      content: '価格を確認したい',
    };

    // 顧客反応3: 2024-01-15 10:30:00、分類: 後ろ向き
    const reaction_3 = {
      timestamp: new Date('2024-01-15T10:30:00Z'),
      classification: '後ろ向き',
      content: '導入は見送る',
    };

    // 順序通り記録: 反応1 → 反応2 → 反応3
    recordCustomerReaction(customer_id, contact_id, reaction_1);
    recordCustomerReaction(customer_id, contact_id, reaction_2);
    recordCustomerReaction(customer_id, contact_id, reaction_3);

    // 逆順で再度送信: 反応2 → 反応1 → 反応3
    recordCustomerReaction(customer_id, contact_id, reaction_2);
    recordCustomerReaction(customer_id, contact_id, reaction_1);
    recordCustomerReaction(customer_id, contact_id, reaction_3);

    // タイムスタンプ昇順で取得
    const recorded_reactions = getCustomerReactionsByTimestamp(customer_id, contact_id);

    // 期待値: タイムスタンプの昇順で並んでいる
    expect(recorded_reactions).toHaveLength(3);
    expect(recorded_reactions[0]).toEqual({
      timestamp: new Date('2024-01-15T10:00:00Z'),
      classification: '前向き',
      content: '提案に興味あり',
    });
    expect(recorded_reactions[1]).toEqual({
      timestamp: new Date('2024-01-15T10:15:00Z'),
      classification: '中立',
      content: '価格を確認したい',
    });
    expect(recorded_reactions[2]).toEqual({
      timestamp: new Date('2024-01-15T10:30:00Z'),
      classification: '後ろ向き',
      content: '導入は見送る',
    });
  });
});