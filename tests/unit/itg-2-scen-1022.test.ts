import { validateCustomerInteractionRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1022
  test('顧客対応記録のテキスト項目が指定文字数の上限直下である場合に形式検証が成功する', () => {
    const max_content_length = 500;
    const test_content = 'a'.repeat(499);
    
    const customer_interaction_record = {
      interaction_id: 'INT-001',
      customer_id: 'CUST-001',
      interaction_date: '2024-01-15',
      content: test_content,
      interaction_type: 'call',
    };

    const validation_result = validateCustomerInteractionRecord(
      customer_interaction_record,
      { content_max_length: max_content_length }
    );

    expect(validation_result.isValid).toBe(true);
    expect(validation_result.errors).toEqual([]);
    expect(validation_result.validatedRecord.content).toBe(test_content);
    expect(validation_result.validatedRecord.content.length).toBe(499);
  });
});