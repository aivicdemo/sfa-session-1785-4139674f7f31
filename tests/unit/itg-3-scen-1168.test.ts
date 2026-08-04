import { prioritizeProposalApproaches } from '../../src/logic/it-1-br-3-3-2-1';

describe('prioritizeProposalApproaches', () => {
  // SCEN-1168
  test('should return empty array when proposal approach candidates are empty', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyApproachCandidates: any[] = [];

    const result = prioritizeProposalApproaches(
      emptyApproachCandidates,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});