import { determineCoachingDirection } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  // SCEN-505
  test('過去の指導履歴が null のとき、エラーが発生する', () => {
    const newBusinessData = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const pastCoachingHistory = null;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'consultative_approach',
        confidenceScore: 85,
      }),
    };

    expect(() =>
      determineCoachingDirection(newBusinessData, pastCoachingHistory, aiRecommendationEngineStub)
    ).toThrow(/指導履歴/);
  });
});