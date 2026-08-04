import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-1560: 類似顧客マッチング処理 - 提案内容の内容データが空文字列のとき、エラーが発生する', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputPayload = {
      purchaseHistory: [
        {
          productId: 'PROD001',
          purchaseDate: '2024-01-15',
          quantity: 100,
          amount: 50000,
        },
      ],
      proposalContent: '',
      customerAttributes: {
        industry: 'manufacturing',
        companySize: 'large',
      },
    };

    expect(() => {
      findSimilarPatterns(inputPayload, aiRecommendationEngineStub);
    }).toThrow(/提案内容データが空文字列|提案内容は必須項目/);

    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
  });
});