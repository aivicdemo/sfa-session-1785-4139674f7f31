import { validateProposalData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-908
  test('提案内容の提案商品が空文字列のとき不整合を検出する', () => {
    const proposalData = {
      proposalProduct: '',
      proposalQuantity: 10,
      proposalAmount: 50000,
      proposalDate: '2024-01-15',
    };

    const result = validateProposalData(proposalData);

    expect(result).toEqual({
      isValid: false,
      errorCode: 'PROPOSAL_PRODUCT_EMPTY',
      errorMessage: '提案商品は必須項目です',
      errorField: 'proposalProduct',
    });
  });
});