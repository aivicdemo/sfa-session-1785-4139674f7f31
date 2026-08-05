import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-426
  test('分類パターンが空文字列のとき、エラーが発生する', () => {
    const input = {
      customer_id: 'CUST-001',
      reaction_datetime: new Date('2024-01-15T14:30:00Z'),
      classification_pattern: '',
      reaction_content: '提案資料に興味を示した',
      contact_method: 'email',
    };

    expect(() => recordCustomerReaction(input)).toThrow(/分類パターン/);
  });
});