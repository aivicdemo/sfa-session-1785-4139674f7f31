import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類・記録機能', () => {
  // SCEN-420
  test('電話応答という顧客反応を標準化された分類パターンに従って記録される', () => {
    const sales_person_id = 'SP001';
    const customer_id = 'CUST001';
    const reaction_type = '電話応答';
    const reaction_detail = '顧客から「製品について詳しく知りたい」という発言があった';
    const classification = '検討中';
    const recorded_at = new Date('2024-01-15T11:00:00Z');

    const result = recordCustomerReaction({
      sales_person_id,
      customer_id,
      reaction_type,
      reaction_detail,
      classification,
      recorded_at,
    });

    expect(result).toEqual({
      customer_reaction_id: expect.any(String),
      sales_person_id: 'SP001',
      customer_id: 'CUST001',
      reaction_type: '電話応答',
      reaction_detail: '顧客から「製品について詳しく知りたい」という発言があった',
      classification: '検討中',
      recorded_at: new Date('2024-01-15T11:00:00Z'),
      created_at: expect.any(Date),
    });

    expect(result.classification).toBe('検討中');
    expect(result.reaction_type).toBe('電話応答');
    expect(result.sales_person_id).toBe('SP001');
    expect(result.customer_id).toBe('CUST001');
    expect(result.recorded_at).toEqual(new Date('2024-01-15T11:00:00Z'));
  });
});