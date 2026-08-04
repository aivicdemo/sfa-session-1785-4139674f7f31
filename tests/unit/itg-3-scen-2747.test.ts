import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 推奨精度スコア基準値判定', () => {
  // SCEN-2747
  test('推奨精度スコアが0.80（基準値に等しい値）のとき、研修実施可と判定される', () => {
    const newCaseCustomerInfo = {
      industry: '情報通信',
      companySize: 'mid-market',
      challengePattern: 'digital_transformation',
      budget: 5000000,
    };

    const successPatternData = {
      pastSuccessCases: [
        {
          caseId: 'case_001',
          industry: '情報通信',
          companySize: 'mid-market',
          challengePattern: 'digital_transformation',
          proposalApproach: 'phase_based_implementation',
          outcomeResult: 'success',
        },
        {
          caseId: 'case_002',
          industry: '情報通信',
          companySize: 'mid-market',
          challengePattern: 'digital_transformation',
          proposalApproach: 'phase_based_implementation',
          outcomeResult: 'success',
        },
      ],
      totalCases: 2,
      successCount: 2,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.80,
        matchedCaseIds: ['case_001', 'case_002'],
        trainingImplementationAllowed: true,
      }),
    };

    const result = evaluatePatternRelevance(
      newCaseCustomerInfo,
      successPatternData,
      mockAIRecommendationEngine
    );

    expect(result.relevanceScore).toBe(0.80);
    expect(result.trainingImplementationAllowed).toBe(true);
    expect(result.judgmentResult).toBe('実施可');
    expect(result.notificationMessage).toContain('過去成功事例との合致度が基準に達しており');
    expect(result.notificationMessage).toContain('推奨研修実施対象');
  });
});