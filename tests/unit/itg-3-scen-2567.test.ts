import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2567
  test('推奨内容と根拠の紐付けが欠落しているとき、例外が発生する', () => {
    const recommendationId = 'REC-20240115-001';
    const recommendation = {
      id: recommendationId,
      customerId: 'CUST-A123',
      proposalContent: '提案内容A',
      confidenceScore: 85,
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(null),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(async () => {
      await displayRecommendationReasoning(
        recommendationId,
        stubAIEngine
      );
    }).rejects.toThrow(/推奨ID/);
  });
});