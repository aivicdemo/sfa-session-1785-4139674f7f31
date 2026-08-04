import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2266
  test('新規案件の顧客条件が空のとき、成功パターンマッチングがエラーになる', () => {
    const newDealData = {
      dealId: 'DEAL-NEW-001',
      customerProfile: '',
      dealConditions: {
        productCategory: 'Software',
        dealValue: 500000,
        timeline: 30,
      },
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    expect(() => {
      findSimilarPatterns(newDealData, mockAIEngine);
    }).toThrow(/customerProfile/);

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});