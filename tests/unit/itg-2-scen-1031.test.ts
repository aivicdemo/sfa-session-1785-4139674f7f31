import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1031
  test('複数件の提案内容に重複するデータが含まれている場合に検証エラーとして拒否される', () => {
    const duplicate_proposal_1 = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-123',
      amount: 1000000,
      proposal_date: '2024-01-15',
    };

    const duplicate_proposal_2 = {
      proposal_id: 'PROP-001',
      customer_id: 'CUST-123',
      amount: 1000000,
      proposal_date: '2024-01-15',
    };

    const proposals = [duplicate_proposal_1, duplicate_proposal_2];

    expect(() => validateSalesDataQuality(proposals)).toThrow(/重複/);
  });
});