import { validateCustomerInteractionRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1011
  test('顧客対応記録のテキスト項目が指定文字数以内である場合に形式検証が成功する', () => {
    const interaction_content = 'A'.repeat(450);
    const customerInteractionRecord = {
      record_id: 'REC-001',
      customer_id: 'CUST-001',
      interaction_date: '2024-01-15',
      interaction_type: 'phone',
      interaction_content: interaction_content,
      interaction_result: 'proposal_made',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    const result = validateCustomerInteractionRecord(customerInteractionRecord);

    expect(result.successful).toBe(true);
    expect(result.validationStatus).toBe('PASSED');
    expect(result.errorMessages).toEqual([]);
  });
});