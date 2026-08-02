import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-909
  test('提案内容の提案作成日が空のとき不整合を検出する', () => {
    const proposalContent = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalCreationDate: '',
      proposalContent: 'Test proposal content'
    };

    const result = validateProposalContent(proposalContent);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorCode: 'PROPOSAL_CREATION_DATE_EMPTY',
          errorMessage: '提案作成日は必須項目です',
          targetField: 'proposalCreationDate'
        })
      ])
    );
  });
});