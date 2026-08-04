import { determineCoachingDirection } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  test('SCEN-505: 過去の指導履歴が null のとき、エラーが発生する', () => {
    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-001',
      industry: 'manufacturing',
      dealSize: 5000000,
      proposalApproach: 'consultative',
      dealStage: 'discovery'
    };

    const pastCoachingHistory = null;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'value-based-selling',
        confidenceScore: 85
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    expect(() => {
      determineCoachingDirection(
        newDealData,
        pastCoachingHistory,
        aiRecommendationEngineStub
      );
    }).toThrow(/指導履歴/);
  });
});