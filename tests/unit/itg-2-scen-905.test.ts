import { validateProposalData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-905
  test('提案内容の提案IDが空文字列のとき不整合を検出する', () => {
    fetchMock.resetMocks();

    const customer_purchase_consideration_data = {
      customer_id: 'CUST-001',
      consideration_status: 'active',
      proposal_content: {
        proposal_id: '',
        proposal_title: 'サービス提案',
        proposal_amount: 100000,
        proposal_date: '2024-01-15'
      }
    };

    const validation_result = validateProposalData(customer_purchase_consideration_data);

    expect(validation_result.is_valid).toBe(false);
    expect(validation_result.error_message).toMatch(/提案ID|proposalId.*empty/);
    expect(validation_result.discrepancy_flag).toBe(true);
  });
});