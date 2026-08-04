import { verifyRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-336: [normal] 推奨精度検証機能 - 検証期間が月初から月末にまたがる場合、期間内の全推奨が対象になる
  test('検証期間が月初から月末にまたがる場合、期間内の全推奨が対象になること', () => {
    const verificationStartDate = new Date('2024-01-31T00:00:00Z');
    const verificationEndDate = new Date('2024-02-01T23:59:59Z');

    const mockRecommendations = [
      {
        recommendationId: 'REC001',
        customerId: 'C001',
        projectId: 'P001',
        generatedAt: new Date('2024-01-15T10:00:00Z'),
        content: 'Recommendation A',
        adoptedFlag: true,
      },
      {
        recommendationId: 'REC002',
        customerId: 'C002',
        projectId: 'P002',
        generatedAt: new Date('2024-01-31T14:30:00Z'),
        content: 'Recommendation B',
        adoptedFlag: true,
      },
      {
        recommendationId: 'REC003',
        customerId: 'C003',
        projectId: 'P003',
        generatedAt: new Date('2024-02-01T09:15:00Z'),
        content: 'Recommendation C',
        adoptedFlag: false,
      },
      {
        recommendationId: 'REC004',
        customerId: 'C004',
        projectId: 'P004',
        generatedAt: new Date('2024-02-15T16:45:00Z'),
        content: 'Recommendation D',
        adoptedFlag: true,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue({}),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
      getRecommendationHistory: jest
        .fn()
        .mockResolvedValue(mockRecommendations),
    };

    const result = verifyRecommendationAccuracy(
      verificationStartDate,
      verificationEndDate,
      mockAIEngine
    );

    expect(result.verifiedRecommendations).toHaveLength(2);
    expect(result.verifiedRecommendations[0].recommendationId).toBe('REC002');
    expect(result.verifiedRecommendations[0].customerId).toBe('C002');
    expect(result.verifiedRecommendations[0].projectId).toBe('P002');
    expect(result.verifiedRecommendations[1].recommendationId).toBe('REC003');
    expect(result.verifiedRecommendations[1].customerId).toBe('C003');
    expect(result.verifiedRecommendations[1].projectId).toBe('P003');
    expect(result.excludedRecommendations).toHaveLength(2);
    expect(result.verificationPeriodStart).toEqual(verificationStartDate);
    expect(result.verificationPeriodEnd).toEqual(verificationEndDate);
  });
});