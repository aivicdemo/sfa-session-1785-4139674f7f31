import { validateSalesProposalData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1018
  test('提案内容の金額項目が空文字列である場合に検証エラーとして拒否される', () => {
    const proposal = {
      proposalId: 'PROP-001',
      customerId: 'CUST-123',
      customerName: '株式会社ABC',
      proposalDate: '2024-01-15',
      amount: '',
      productCategory: '営業支援ツール',
      quantity: 1,
      unitPrice: 100000,
    };

    expect(() => validateSalesProposalData(proposal)).toThrow(/金額/);
  });
});