import { evaluateDetectionResultValidity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-848: 根拠信頼度が信頼性下限超のとき根拠判定が成立する', () => {
    // Arrange
    const trustThresholdConfig = {
      minTrustThreshold: 0.50,
    };

    const detectionResult = {
      problemId: 'prob_001',
      problemType: 'inappropriate_proposal_pattern',
      severity: 'high',
      confidenceScore: 0.51,
      baselineConfidenceThreshold: 0.50,
      reasoning: {
        factors: [
          {
            name: 'proposal_deviation',
            weight: 0.6,
            evidence: 'Proposal content deviates 35% from standard process',
          },
          {
            name: 'customer_response_pattern',
            weight: 0.4,
            evidence: 'Customer engagement rate below historical average',
          },
        ],
        trustScore: 0.51,
      },
      actionRequired: null,
      validityStatus: null,
    };

    // Act
    const result = evaluateDetectionResultValidity(
      detectionResult,
      trustThresholdConfig.minTrustThreshold
    );

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.validityStatus).toBe('established');
    expect(result.actionRequired).toBe(true);
    expect(result.reasoning.trustScore).toBeGreaterThan(
      trustThresholdConfig.minTrustThreshold
    );
  });
});