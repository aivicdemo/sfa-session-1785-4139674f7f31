import { validateCustomerInteractionRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1017
  test('顧客対応記録の対応日時項目が欠けている場合に検証エラーとして拒否される', () => {
    const mock_customer_interaction_record = {
      interaction_id: 'INT-2024-001',
      customer_id: 'CUST-12345',
      interaction_type: '電話',
      interaction_content: '商品説明実施',
      interaction_date: undefined,
      created_by: 'USER-001',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const validation_result = () => {
      return validateCustomerInteractionRecord(mock_customer_interaction_record);
    };

    expect(validation_result).toThrow(/対応日時/);
  });
});