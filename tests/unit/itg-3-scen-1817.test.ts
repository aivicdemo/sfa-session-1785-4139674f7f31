import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Relevance Evaluation', () => {
  // SCEN-1817
  test('should rank applicable success patterns by relevance score in descending order', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ patternId: 'A', relevanceScore: 0.95 })
        .mockResolvedValueOnce({ patternId: 'C', relevanceScore: 0.88 })
        .mockResolvedValueOnce({ patternId: 'B', relevanceScore: 0.78 })
        .mockResolvedValueOnce({ patternId: 'D', relevanceScore: 0.65 })
    };

    const successPatterns = [
      { patternId: 'A', description: 'Pattern A' },
      { patternId: 'B', description: 'Pattern B' },
      { patternId: 'C', description: 'Pattern C' },
      { patternId: 'D', description: 'Pattern D' }
    ];

    const newDealData = {
      customerIndustry: 'IT',
      budget: 5000000,
      decisionMakerCount: 3
    };

    const result = await evaluatePatternRelevance(
      successPatterns,
      newDealData,
      mockAIEngine
    );

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      patternId: 'A',
      relevanceScore: 0.95
    });
    expect(result[1]).toEqual({
      patternId: 'C',
      relevanceScore: 0.88
    });
    expect(result[2]).toEqual({
      patternId: 'B',
      relevanceScore: 0.78
    });
    expect(result[3]).toEqual({
      patternId: 'D',
      relevanceScore: 0.65
    });
  });
});