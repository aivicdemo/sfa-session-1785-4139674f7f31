import { validateProposalContent } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-1014: 提案内容の提案ID項目が欠けている場合に検証エラーとして拒否される', () => {
    const proposalContent = {
      proposal_name: '新規営業提案',
      proposal_amount: 1000000,
      customer_id: 'CUST-001',
      proposal_id: undefined,
    };

    const result = validateProposalContent(proposalContent);

    expect(result.status).toBe('ERROR');
    expect(result.error_code).toBe('MISSING_PROPOSAL_ID');
    expect(result.error_message).toBe('提案内容の提案ID項目が欠けています');
  });
});