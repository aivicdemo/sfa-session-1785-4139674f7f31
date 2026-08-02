import { validateProposalRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 提案・顧客対応記録の必須項目検証', () => {
  test('SCEN-1000: 顧客IDが空の場合にフォーム送信が拒否され警告メッセージが表示される', () => {
    const proposalRecord = {
      customer_id: '',
      proposal_date: '2024-01-15',
      proposal_content: 'クラウドシステム導入提案',
      proposed_amount: 500000,
      follow_up_date: '2024-01-22'
    };

    const result = validateProposalRecord(proposalRecord);

    expect(result.is_valid).toBe(false);
    expect(result.error_message).toMatch(/顧客ID/);
    expect(result.field_name).toBe('customer_id');
  });
});