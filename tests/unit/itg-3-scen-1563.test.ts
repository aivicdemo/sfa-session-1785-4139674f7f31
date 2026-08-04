import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  test('SCEN-1563: 購買履歴の日付フォーマットが不正なとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidDateFormats = [
      '2024/13/45',
      '2024-13-01',
      'invalid-date',
      '2024年1月1日',
    ];

    invalidDateFormats.forEach((invalidDate) => {
      const purchaseHistory = {
        customerId: 'CUST-001',
        purchaseDate: invalidDate,
        productCategory: '情報システム',
        purchaseAmount: 5000000,
      };

      expect(() =>
        findSimilarPatterns(purchaseHistory, mockAIEngine)
      ).toThrow(/購買履歴の日付フォーマット/);
    });
  });
});