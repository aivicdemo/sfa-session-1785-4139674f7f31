import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2871
  test('営業管理職の検証日時が null のとき、エラーを返す', () => {
    const managerVerifier = {
      managerId: 'MGR-001',
      managerName: '営業部長 太郎',
      verificationDate: null,
      verificationStatus: 'pending' as const,
    };

    const recommendationContent = {
      recommendationId: 'REC-12345',
      customerId: 'CUST-001',
      proposalApproach: '顧客の課題に対応した提案を実施',
      proposedAction: 'フォローアップ実施',
      reasoningBasis: {
        pastSuccessPatterns: ['パターンA', 'パターンB'],
        customerDataPoints: ['データ1', 'データ2'],
        timingFactors: ['タイミング因子1'],
      },
      confidenceScore: 85,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendationContent),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    expect(() =>
      validateRecommendationContent(
        managerVerifier,
        recommendationContent,
        mockAIEngine
      )
    ).toThrow(/検証日時/);
  });
});