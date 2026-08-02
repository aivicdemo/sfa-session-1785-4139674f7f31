import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-913
  test('提案内容の提案金額が無限大のとき異常値として検出する', () => {
    const proposalContent = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-001',
      proposal_amount: Infinity,
      product_name: 'Test Product',
      proposal_date: '2024-01-15T11:00:00Z',
    };

    const result = validateProposalContent(proposalContent);

    expect(result.status).toBe('validation_failed');
    expect(result.error_message).toMatch(/提案金額が無限大です/);
    expect(result.is_valid).toBe(false);
  });
});