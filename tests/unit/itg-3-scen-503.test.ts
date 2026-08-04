import { determineSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  test('SCEN-503: 指導対象項目が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        approachType: 'PROPOSAL_TIMING',
        confidence: 85,
        reasoning: 'Based on purchase history analysis'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const invalidGuidancePolicyRequest = {
      salesPersonId: 'sp_001',
      dealId: 'deal_001',
      customerId: 'cust_001',
      customerIndustry: 'Manufacturing',
      customerScale: 'Large',
      guidanceTargetItem: null,
      guidanceType: 'IMPROVEMENT',
      dealStage: 'PROPOSAL'
    };

    expect(() =>
      determineSalesGuidancePolicy(
        invalidGuidancePolicyRequest,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/guidanceTargetItem/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});