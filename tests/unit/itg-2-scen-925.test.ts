import { validateCustomerPurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-925
  test('提案内容の提案IDが最大許容文字列長を超過するとき長さエラーを検出する', () => {
    const max_proposal_id_length = 255;
    const exceeding_proposal_id = 'A'.repeat(max_proposal_id_length + 1);
    const customer_id = 'CUST001';
    const proposal_content = 'Software license renewal for 100 seats';
    
    const input = {
      customer_id: customer_id,
      proposal_id: exceeding_proposal_id,
      proposal_content: proposal_content,
    };
    
    const result = validateCustomerPurchaseData(input);
    
    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('PROPOSAL_ID_LENGTH_EXCEEDED');
    expect(result.error_message).toMatch(/提案ID/);
    expect(result.error_message).toMatch(new RegExp(max_proposal_id_length.toString()));
    expect(result.error_message).toMatch(new RegExp((max_proposal_id_length + 1).toString()));
  });
});