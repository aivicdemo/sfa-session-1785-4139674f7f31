import { calculatePriorityRank } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善優先度ランク算出', () => {
  // SCEN-529: [edge] 改善優先度ランク算出機能 - 優先度判定対象に重複データを含むとき重複が除外される
  test('should exclude duplicates and calculate priority ranks correctly', () => {
    const inputData = [
      { id: 'P001', score: 85, category: 'sales' },
      { id: 'P001', score: 85, category: 'sales' },
      { id: 'P002', score: 72, category: 'support' },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern) => {
        const scoreMap: { [key: string]: number } = {
          'P001': 85,
          'P002': 72,
        };
        return scoreMap[pattern.id] || 0;
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = calculatePriorityRank(inputData, mockAIEngine);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'P001',
      score: 85,
      category: 'sales',
      priority_rank: 1,
    });
    expect(result[1]).toEqual({
      id: 'P002',
      score: 72,
      category: 'support',
      priority_rank: 2,
    });

    const duplicateRecord = result.find(
      (item) => item.id === 'P001' && result.filter((r) => r.id === 'P001').length > 1
    );
    expect(duplicateRecord).toBeUndefined();

    const uniqueIds = new Set(result.map((item) => item.id));
    expect(uniqueIds.size).toBe(result.length);
  });
});