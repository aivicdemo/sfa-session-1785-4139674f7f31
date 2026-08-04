import { calculateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-351
  test('推奨が複数の商談詳細に紐付く場合、全件が精度計測に含まれる', async () => {
    const recommendationId = 'REC-001';
    const dealDetailRecords = [
      { dealId: 'DEAL-101', accuracyScore: 85 },
      { dealId: 'DEAL-102', accuracyScore: 72 },
      { dealId: 'DEAL-103', accuracyScore: 90 },
    ];
    const expectedMeasuredCount = 3;
    const expectedDealIds = new Set(['DEAL-101', 'DEAL-102', 'DEAL-103']);
    const expectedAverageAccuracy = 82.33;

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({ success: true }),
      findSimilarPatterns: jest.fn().mockResolvedValue({ patterns: [] }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({ explanation: '' }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({ relevanceScore: 0 }),
    };

    const result = await calculateRecommendationAccuracy(
      recommendationId,
      dealDetailRecords,
      mockAIEngine
    );

    expect(result.measuredCount).toBe(expectedMeasuredCount);
    expect(result.measuredDealIds).toEqual(expectedDealIds);
    expect(Math.round(result.averageAccuracy * 100) / 100).toBe(expectedAverageAccuracy);
  });
});