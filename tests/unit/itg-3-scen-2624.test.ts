import { evaluateSuccessPatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2624
  test('成功パターン自動判定機能 - 顧客属性が空のとき、判定エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealDataWithEmptyCustomerAttributes = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      customerAttributes: {},
      dealConditions: {
        industryType: 'manufacturing',
        dealSize: 5000000,
        timeline: 'Q2-2025',
      },
    };

    expect(() =>
      evaluateSuccessPatternRelevance(dealDataWithEmptyCustomerAttributes, mockAIEngine)
    ).toThrow(/CUSTOMER_ATTRIBUTES_EMPTY|顧客属性が入力されていません/);
  });
});