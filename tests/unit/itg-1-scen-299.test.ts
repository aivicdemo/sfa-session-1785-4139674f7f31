import { standardizeCustomerReactions } from '../../src/logic/it-1-br-2-1-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-299
  test('複数の顧客反応が全て標準化されて記録される', async () => {
    const execution_timestamp = new Date('2024-06-15T10:30:00Z');
    
    const customer_reactions_input = [
      {
        reaction_id: 'react_001',
        customer_id: 'cust_101',
        reaction_text: '問い合わせあり',
        recorded_at: new Date('2024-06-15T10:00:00Z'),
        standardized: false,
        standardized_code: null,
      },
      {
        reaction_id: 'react_002',
        customer_id: 'cust_102',
        reaction_text: '資料請求',
        recorded_at: new Date('2024-06-15T10:05:00Z'),
        standardized: false,
        standardized_code: null,
      },
      {
        reaction_id: 'react_003',
        customer_id: 'cust_103',
        reaction_text: 'デモ希望',
        recorded_at: new Date('2024-06-15T10:10:00Z'),
        standardized: false,
        standardized_code: null,
      },
    ];

    const result = await standardizeCustomerReactions({
      customer_reactions: customer_reactions_input,
      execution_timestamp: execution_timestamp,
    });

    expect(result.processed_count).toBe(3);
    expect(result.success_count).toBe(3);
    expect(result.failure_count).toBe(0);

    expect(result.standardized_reactions).toHaveLength(3);

    const reaction_1 = result.standardized_reactions[0];
    expect(reaction_1.reaction_id).toBe('react_001');
    expect(reaction_1.standardized_code).toBe('contact_inquiry');
    expect(reaction_1.standardized).toBe(true);
    expect(new Date(reaction_1.standardized_at).getTime()).toBeGreaterThanOrEqual(
      execution_timestamp.getTime()
    );

    const reaction_2 = result.standardized_reactions[1];
    expect(reaction_2.reaction_id).toBe('react_002');
    expect(reaction_2.standardized_code).toBe('document_request');
    expect(reaction_2.standardized).toBe(true);
    expect(new Date(reaction_2.standardized_at).getTime()).toBeGreaterThanOrEqual(
      execution_timestamp.getTime()
    );

    const reaction_3 = result.standardized_reactions[2];
    expect(reaction_3.reaction_id).toBe('react_003');
    expect(reaction_3.standardized_code).toBe('demo_request');
    expect(reaction_3.standardized).toBe(true);
    expect(new Date(reaction_3.standardized_at).getTime()).toBeGreaterThanOrEqual(
      execution_timestamp.getTime()
    );

    expect(result.standardized_reactions.every((r) => r.standardized === true)).toBe(true);
    expect(
      result.standardized_reactions.every(
        (r) => new Date(r.standardized_at).getTime() >= execution_timestamp.getTime()
      )
    ).toBe(true);
  });
});