import { recordCustomerReactionWithClassification } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類記録機能', () => {
  // SCEN-442
  test('分類パターン数が最大許容値を超えるとき、エラーコードとともに記録される', () => {
    const max_classification_patterns = 50;
    const existing_patterns = Array.from({ length: max_classification_patterns }, (_, i) => ({
      pattern_id: `pattern_${i + 1}`,
      pattern_name: `Classification Pattern ${i + 1}`,
    }));

    const new_reaction = {
      customer_id: 'cust_12345',
      reaction_type: 'email_reply',
      reaction_timestamp: new Date('2024-01-15T14:30:00Z'),
      classification_pattern_id: 'pattern_51',
      classification_pattern_name: 'New Pattern Exceeding Limit',
      reaction_text: 'Customer response text',
      ai_confidence_score: 0.92,
    };

    const result = recordCustomerReactionWithClassification(
      new_reaction,
      existing_patterns,
      max_classification_patterns
    );

    expect(result.success).toBe(false);
    expect(result.error_code).toBe('CLASSIFICATION_PATTERN_EXCEEDED');
    expect(result.audit_log_message).toBe(
      'Classification pattern count exceeded maximum allowed value of 50. Attempt value: 51'
    );
    expect(result.attempted_pattern_count).toBe(51);
    expect(result.max_allowed_patterns).toBe(50);
  });
});