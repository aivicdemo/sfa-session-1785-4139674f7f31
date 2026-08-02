import { validateProposalRequired } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1009
  test('提案内容の必須項目がすべて入力されている場合に形式検証が成功する', () => {
    const proposal = {
      proposalName: '顧客A向けシステム導入提案',
      proposalAmount: 5000000,
      proposalDeadline: '2024-12-31',
      proposalContent: 'クラウドシステム導入支援',
      assignedUserId: 'U001'
    };

    const result = validateProposalRequired(proposal);

    expect(result).toEqual({
      isValid: true,
      errors: []
    });
  });
});