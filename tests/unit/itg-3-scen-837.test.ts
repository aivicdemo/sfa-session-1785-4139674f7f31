import { calculateTrustScoreWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-837
  test('推奨内容の信頼度スコア算出・根拠提示機能 - 根拠データが null のときエラーで処理が進まない', () => {
    const newDealData = {
      customerId: 'cust_001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealCondition: 'new_product_proposal',
      dealAmount: 5000000,
      dealStage: 'qualification'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 85,
        evidenceData: null
      })
    };

    expect(() => {
      calculateTrustScoreWithReasoning(newDealData, mockAIEngine);
    }).toThrow(/根拠データ/);
  });
});