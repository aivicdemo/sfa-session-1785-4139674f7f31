import { extractSuccessPatternsWithFailureThreshold } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  // SCEN-2585
  test('失敗した商談件数が閾値直下のとき、失敗パターンに含まれる', () => {
    const failureThreshold = 10;
    const failedDealCount = 9;
    
    const pastDeals = Array.from({ length: failedDealCount }, (_, i) => ({
      deal_id: `deal_${i}`,
      customer_industry: 'manufacturing',
      customer_size: 'large',
      deal_status: 'lost',
      deal_amount: 500000 + i * 10000,
      created_at: new Date('2024-01-01').toISOString(),
    }));

    const successPatternMasterData = [
      {
        pattern_id: 'pat_001',
        pattern_type: 'failure',
        customer_industry: 'manufacturing',
        customer_size: 'large',
        description: 'Large manufacturing companies lost due to budget constraints',
        occurrence_count: 8,
      },
    ];

    let findSimilarPatternsCallCount = 0;
    let findSimilarPatternsCallParams: any = null;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn((conditions: any) => {
        findSimilarPatternsCallCount++;
        findSimilarPatternsCallParams = conditions;
        return Promise.resolve(successPatternMasterData);
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSuccessPatternsWithFailureThreshold(
      pastDeals,
      failureThreshold,
      aiRecommendationEngineStub,
    );

    expect(result.failure_patterns).toEqual(successPatternMasterData);
    expect(result.failure_pattern_count).toBe(1);
    expect(result.should_extract_failure_patterns).toBe(true);
    expect(findSimilarPatternsCallCount).toBe(1);
    expect(findSimilarPatternsCallParams).toMatchObject({
      pattern_type: 'failure',
    });
  });
});