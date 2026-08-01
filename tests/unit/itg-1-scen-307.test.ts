import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-307
  test('顧客反応の重複記録が明確に処理される', () => {
    const customer_id = 'CUST-001';
    const reaction_type = 'inquiry';
    const recorded_at = '2024-01-15T10:30:00Z';

    const first_input = {
      customer_id,
      reaction_type,
      recorded_at,
      reaction_content: 'Initial inquiry',
    };

    const first_result = recordCustomerReaction(first_input);
    expect(first_result.success).toBe(true);
    expect(first_result.record_count).toBe(1);

    const duplicate_input = {
      customer_id,
      reaction_type,
      recorded_at,
      reaction_content: 'Duplicate inquiry',
    };

    const duplicate_result = recordCustomerReaction(duplicate_input);

    if (duplicate_result.duplicate_policy === 'overwrite') {
      expect(duplicate_result.success).toBe(true);
      expect(duplicate_result.record_count).toBe(1);
      expect(duplicate_result.operation_type).toBe('overwrite');
    } else if (duplicate_result.duplicate_policy === 'keep_separate') {
      expect(duplicate_result.record_count).toBe(2);
      expect(duplicate_result.operation_type).toBe('separate');
    } else if (duplicate_result.duplicate_policy === 'reject') {
      expect(duplicate_result.success).toBe(false);
      expect(duplicate_result.error_message).toMatch(/重複/);
    }

    expect(duplicate_result.duplicate_policy).toMatch(/overwrite|keep_separate|reject/);
    expect(typeof duplicate_result.duplicate_policy).toBe('string');
  });
});