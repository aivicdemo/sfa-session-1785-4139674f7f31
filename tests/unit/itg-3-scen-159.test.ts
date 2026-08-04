import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Similar Pattern Search Ranking', () => {
  // SCEN-159
  test('should rank patterns by creation date descending when similarity scores are identical', async () => {
    const mockPatternA = {
      id: 'Pattern-A',
      similarity_score: 0.85,
      created_at: '2026-01-15T10:00:00Z',
      approach: 'Approach A',
      success_rate: 0.8,
    };

    const mockPatternB = {
      id: 'Pattern-B',
      similarity_score: 0.85,
      created_at: '2026-01-10T14:30:00Z',
      approach: 'Approach B',
      success_rate: 0.79,
    };

    const mockPatternC = {
      id: 'Pattern-C',
      similarity_score: 0.85,
      created_at: '2026-01-20T09:15:00Z',
      approach: 'Approach C',
      success_rate: 0.82,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockPatternA,
        mockPatternB,
        mockPatternC,
      ]),
    };

    const search_condition = {
      industry: 'IT',
      budget: 5000000,
      challenge: 'DX推進',
    };

    const result = await findSimilarPatterns(search_condition, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('Pattern-C');
    expect(result[0].created_at).toBe('2026-01-20T09:15:00Z');
    expect(result[0].similarity_score).toBe(0.85);
    expect(result[1].id).toBe('Pattern-A');
    expect(result[1].created_at).toBe('2026-01-15T10:00:00Z');
    expect(result[1].similarity_score).toBe(0.85);
    expect(result[2].id).toBe('Pattern-B');
    expect(result[2].created_at).toBe('2026-01-10T14:30:00Z');
    expect(result[2].similarity_score).toBe(0.85);
  });
});