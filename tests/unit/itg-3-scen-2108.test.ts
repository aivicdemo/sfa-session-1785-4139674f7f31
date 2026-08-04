import { calculateDeviationScoreFromStandardProcess } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と標準プロセスの乖離度算出', () => {
  test('SCEN-2108: 成功パターンデータが null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue(null),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customer_id: 'CUST-001',
      customer_industry: '製造業',
      customer_scale: '大企業',
      deal_value: 5000000,
      deal_stage: '提案段階',
      proposal_content: {
        product_category: 'システムソリューション',
        implementation_period: 6,
        price: 3500000,
      },
    };

    expect(() => {
      calculateDeviationScoreFromStandardProcess(
        newDealData,
        mockAIRecommendationEngine
      );
    }).toThrow(/成功パターン/);
  });
});