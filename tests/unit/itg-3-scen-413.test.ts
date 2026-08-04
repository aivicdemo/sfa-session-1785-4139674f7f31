import { verifyInferenceAccuracyByApprovalState } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推論精度検証', () => {
  // SCEN-413
  test('検証対象期間内の商談が複数の承認状態を遷移しているとき、状態ごとの精度差分を計測', () => {
    const verificationPeriodStart = new Date('2024-01-01T00:00:00Z');
    const verificationPeriodEnd = new Date('2024-01-31T23:59:59Z');

    const dealATransitions = [
      {
        dealId: 'DEAL-A',
        transitionTimestamp: new Date('2024-01-05T10:00:00Z'),
        fromApprovalState: 'unapproved',
        toApprovalState: 'approved',
        recommendationAccuracyScore: 0.72,
      },
      {
        dealId: 'DEAL-A',
        transitionTimestamp: new Date('2024-01-15T14:30:00Z'),
        fromApprovalState: 'approved',
        toApprovalState: 'approved',
        recommendationAccuracyScore: 0.85,
      },
    ];

    const dealBTransitions = [
      {
        dealId: 'DEAL-B',
        transitionTimestamp: new Date('2024-01-08T09:00:00Z'),
        fromApprovalState: 'unapproved',
        toApprovalState: 'approved',
        recommendationAccuracyScore: 0.72,
      },
      {
        dealId: 'DEAL-B',
        transitionTimestamp: new Date('2024-01-20T11:45:00Z'),
        fromApprovalState: 'approved',
        toApprovalState: 'unapproved',
        recommendationAccuracyScore: 0.72,
      },
    ];

    const dealCTransitions = [
      {
        dealId: 'DEAL-C',
        transitionTimestamp: new Date('2024-01-12T16:20:00Z'),
        fromApprovalState: 'approved',
        toApprovalState: 'approved',
        recommendationAccuracyScore: 0.85,
      },
    ];

    const allTransitions = [
      ...dealATransitions,
      ...dealBTransitions,
      ...dealCTransitions,
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = verifyInferenceAccuracyByApprovalState(
      allTransitions,
      verificationPeriodStart,
      verificationPeriodEnd,
      mockAIRecommendationEngine
    );

    expect(result.unapprovedAverageAccuracy).toBe(0.72);
    expect(result.approvedAverageAccuracy).toBe(0.85);
    expect(result.accuracyDifference).toBe(0.13);
    expect(result.unapprovedClassifiedCount).toBe(2);
    expect(result.approvedClassifiedCount).toBe(3);
    expect(result.verificationPeriodStart).toEqual(verificationPeriodStart);
    expect(result.verificationPeriodEnd).toEqual(verificationPeriodEnd);
  });
});