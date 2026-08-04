import { determineGuidancePolicyForSalesPerson } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-503: 指導対象項目が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-123',
        proposedApproach: 'test approach',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const guidancePolicyRequest = {
      salesPersonId: 'sp-001',
      dealId: 'deal-100',
      customerInfo: {
        customerId: 'cust-001',
        industry: 'technology',
        companyScale: 'large',
      },
      guidanceTargetItem: null as any,
      dealProgress: 'proposal_stage',
      timestamp: new Date('2026-08-01T10:00:00Z'),
    };

    expect(() =>
      determineGuidancePolicyForSalesPerson(
        guidancePolicyRequest,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/guidanceTargetItem/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});