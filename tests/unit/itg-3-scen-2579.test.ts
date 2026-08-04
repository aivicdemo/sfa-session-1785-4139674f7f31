import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  // SCEN-2579
  test('過去商談データが1件のとき、1つの成功パターンが抽出される', () => {
    const pastDealData = {
      dealId: 'DEAL-001',
      customerIndustry: 'IT',
      customerSize: 'large',
      challenge: 'システム統合',
      proposalApproach: 'クラウド移行支援',
      closedWon: true,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN-001',
          successFactors: {
            industry: 'IT',
            challenge: 'システム統合',
            proposalApproach: 'クラウド移行支援',
          },
          applicableConditions: {
            targetCustomerSize: 'large',
            industry: 'IT',
          },
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSuccessPatterns(pastDealData, mockAIRecommendationEngine);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('patternId');
    expect(result[0].patternId).toBe('PATTERN-001');
    expect(result[0]).toHaveProperty('successFactors');
    expect(result[0].successFactors).toEqual({
      industry: 'IT',
      challenge: 'システム統合',
      proposalApproach: 'クラウド移行支援',
    });
    expect(result[0]).toHaveProperty('applicableConditions');
    expect(result[0].applicableConditions).toEqual({
      targetCustomerSize: 'large',
      industry: 'IT',
    });
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      pastDealData
    );
  });
});