import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1559
  test('[error] 類似顧客マッチング処理 - 購買履歴の顧客IDが空文字列のとき、エラーが発生する', () => {
    const purchase_history = {
      customerId: '',
      productCategory: 'software',
      purchaseAmount: 50000,
      purchaseDate: '2024-01-15T10:00:00Z',
      frequency: 'monthly'
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      findSimilarPatterns(purchase_history, aiRecommendationEngineStub);
    }).toThrow(/INVALID_CUSTOMER_ID/);

    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
  });
});