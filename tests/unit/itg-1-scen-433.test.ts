import { standardizeCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-433
  test('反応タイプが定義済み分類に含まれていないとき、エラーが発生する', () => {
    const defined_reaction_types = ['肯定的', '中立的', '否定的'];
    const invalid_reaction_type = '未分類';
    
    const customer_reaction_record = {
      reaction_type: invalid_reaction_type,
      customer_id: 'CUST-001',
      contact_date: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() =>
      standardizeCustomerReaction(customer_reaction_record, defined_reaction_types)
    ).toThrow(/INVALID_REACTION_TYPE/);
  });
});