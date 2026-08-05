import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類・記録機能', () => {
  // SCEN-419
  test('メール返信という顧客反応を標準化された分類パターンに従って記録される', () => {
    const input = {
      customer_reaction_code: 'MAIL_REPLY',
      customer_reaction_name: 'メール返信',
      contact_content: '顧客より提案資料に対する質問メールが届いた',
      contact_datetime: '2024-01-15 10:30:00',
    };

    const result = recordCustomerReaction(input);

    expect(result).toEqual({
      customer_reaction_code: 'MAIL_REPLY',
      customer_reaction_name: 'メール返信',
      contact_content: '顧客より提案資料に対する質問メールが届いた',
      contact_datetime: '2024-01-15 10:30:00',
      status: '記録済み',
    });
  });
});