import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2804
  test('参考事例が1件も含まれていないとき、エラーコード ERR_NO_REFERENCE_CASES_FOUND を返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companySize: 500,
      dealConditions: {
        dealId: 'DEAL-001',
        dealStage: 'initial_proposal',
        dealAmount: 5000000,
        dealTimeline: 90,
      },
    };

    const result = explainRecommendationReasoning(newDealData, mockAIRecommendationEngine);

    expect(result).toEqual({
      success: false,
      errorCode: 'ERR_NO_REFERENCE_CASES_FOUND',
      errorMessage: '推奨根拠の生成に必要な参考事例が見つかりません。十分な過去商談データがないため、根拠の可視化ができません',
      statusCode: 400,
    });
  });
});