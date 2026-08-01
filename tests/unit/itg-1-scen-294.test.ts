import { recordCustomerReactionWithStandardization } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-294
  test('顧客反応記録・標準化機能 - 電話応答反応を標準分類パターンに従って記録される', () => {
    const input_channel = 'phone_response';
    const input_content = '顧客が製品説明に対して積極的な質問を3件提示';
    const input_timestamp = new Date('2024-01-15T14:30:00Z');

    const result = recordCustomerReactionWithStandardization({
      channel: input_channel,
      content: input_content,
      timestamp: input_timestamp,
    });

    expect(result).toEqual({
      channel: 'phone_response',
      content: '顧客が製品説明に対して積極的な質問を3件提示',
      timestamp: '2024-01-15T14:30:00Z',
      classification: {
        reaction_type: 'ポジティブ',
        interest_level: '高',
        next_action: 'フォローアップ営業',
        score: 85,
      },
      is_recorded: true,
    });
  });
});