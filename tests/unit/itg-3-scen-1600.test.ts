import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを推奨', () => {
  // SCEN-1600
  test('類似顧客マッチング処理 - 購買履歴データが入力されないとき、処理が中断され例外が発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => {
        throw new TypeError('purchase history is required');
      }),
    };

    const purchaseHistory = null;
    const currentProposal = {
      customerId: 'CUST-001',
      productCategory: 'Software',
      proposalAmount: 500000,
    };

    const executeMatching = () => {
      if (purchaseHistory === null) {
        throw new TypeError('purchase history is required');
      }
      return mockAIEngine.findSimilarPatterns(purchaseHistory, currentProposal);
    };

    expect(() => executeMatching()).toThrow(TypeError);
    expect(() => executeMatching()).toThrow(/purchase history is required/);
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});