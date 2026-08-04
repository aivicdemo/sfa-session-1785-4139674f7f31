import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIRecommendationEngine - generateRecommendation with empty historical data', () => {
  // SCEN-855
  test('should throw error when historical deal data is empty array', () => {
    const engine = new AIRecommendationEngine();

    const emptyHistoricalData: any[] = [];
    const newDealInfo = {
      customerName: 'Acme Corporation',
      productCategory: 'Enterprise Software',
      budget: 500000,
      industry: 'Manufacturing',
      companySize: 'Large',
    };

    const result = engine.generateRecommendation(
      emptyHistoricalData,
      newDealInfo
    );

    expect(result).toEqual({
      errorCode: 'EMPTY_HISTORICAL_DATA',
      message: '過去商談データが存在しません。推奨の生成ができません',
    });
    expect(result.recommendationContent).toBeUndefined();
    expect(result.confidenceScore).toBeUndefined();
    expect(result.reasoning).toBeUndefined();
  });
});