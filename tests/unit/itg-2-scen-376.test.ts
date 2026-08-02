import { detectMissingCustomerId } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-376
  test('[normal] 提案履歴の顧客IDが空の場合、顧客ID漏れとして検出される', () => {
    const proposal_record_id = 'PROP_001';
    const detected_at = new Date('2024-01-15T10:30:00Z');

    const input_with_empty_customer_id = {
      proposal_id: proposal_record_id,
      customer_id: '',
      product_name: 'Product A',
      proposal_date: '2024-01-10',
      amount: 100000,
      status: 'pending'
    };

    const result = detectMissingCustomerId(input_with_empty_customer_id, detected_at);

    expect(result).toEqual({
      error_code: 'CUST_ID_MISSING',
      error_message: '顧客ID漏れ',
      target_record_id: proposal_record_id,
      detected_at: detected_at
    });
  });
});