import { evaluateProposalRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 月初の期間判定', () => {
  test('SCEN-1275: 提案妥当性判定時刻が月初である場合に期間判定が正確に行われる', () => {
    const mockEvaluatePatternRelevance = jest.fn(() => ({
      period_relevance_score: 0.78,
      reasoning: 'Past pattern from March 1-31 matches current deal initiated March 15 with 15-day duration',
    }));

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const dealStartDate = new Date('2024-03-15T00:00:00Z');
    const dealDurationDays = 15;
    const pastPatternStartDate = new Date('2024-03-01T00:00:00Z');
    const pastPatternEndDate = new Date('2024-03-31T23:59:59Z');
    const evaluationDate = new Date('2024-04-01T00:00:00Z');

    const proposalInput = {
      dealStartDate: dealStartDate,
      dealDurationDays: dealDurationDays,
      pastPatternId: 'pattern_001',
      pastPatternStartDate: pastPatternStartDate,
      pastPatternEndDate: pastPatternEndDate,
      evaluationDate: evaluationDate,
      aiEngine: mockAIRecommendationEngine,
    };

    const result = evaluateProposalRelevance(proposalInput);

    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(result.period_relevance_score).toBeGreaterThanOrEqual(0.75);
    expect(result.period_relevance_score).toBeLessThanOrEqual(1.0);
    expect(result.period_relevance_score).toBe(0.78);
    expect(result.reasoning).toContain('March 1-31');
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealStartDate: dealStartDate,
        dealDurationDays: dealDurationDays,
        pastPatternStartDate: pastPatternStartDate,
        pastPatternEndDate: pastPatternEndDate,
        evaluationDate: evaluationDate,
      })
    );
  });
});