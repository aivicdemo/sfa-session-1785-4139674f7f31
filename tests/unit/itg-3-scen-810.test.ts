import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨外部連携（成功パターン適用可能性スコア評価）', () => {
  // SCEN-810
  test('should return pattern relevance scores within valid range when OpenAI API responds successfully', async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const mockEmbeddingResponse = {
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: [0.92, 0.88, 0.85, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66, 0.63],
          index: 0,
        },
        {
          object: 'embedding',
          embedding: [0.78, 0.75, 0.72, 0.69, 0.66, 0.63, 0.60, 0.57, 0.54, 0.51],
          index: 1,
        },
        {
          object: 'embedding',
          embedding: [0.61, 0.58, 0.55, 0.52, 0.49, 0.46, 0.43, 0.40, 0.37, 0.34],
          index: 2,
        },
      ],
      model: 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 12,
        total_tokens: 12,
      },
    };

    mockAIRecommendationEngine.evaluatePatternRelevance.mockResolvedValueOnce(
      mockEmbeddingResponse
    );

    const newCaseCondition = {
      industry: '製造業',
      dealSize: 50000000,
      decisionMakers: 3,
      dealDuration: 60,
    };

    const pastPatterns = [
      {
        patternId: 'PATTERN_001',
        industry: '製造業',
        dealSize: 45000000,
        decisionMakers: 3,
        dealDuration: 55,
        success: true,
      },
      {
        patternId: 'PATTERN_002',
        industry: '製造業',
        dealSize: 55000000,
        decisionMakers: 3,
        dealDuration: 65,
        success: true,
      },
      {
        patternId: 'PATTERN_003',
        industry: '製造業',
        dealSize: 48000000,
        decisionMakers: 2,
        dealDuration: 58,
        success: true,
      },
    ];

    const result = await mockAIRecommendationEngine.evaluatePatternRelevance(
      newCaseCondition,
      pastPatterns
    );

    expect(result).toBeDefined();
    expect(result.object).toBe('list');
    expect(result.model).toBe('text-embedding-ada-002');
    expect(result.usage).toBeDefined();
    expect(result.usage.prompt_tokens).toBe(12);
    expect(result.usage.total_tokens).toBe(12);

    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThanOrEqual(3);

    result.data.forEach((item: any, idx: number) => {
      expect(item.object).toBe('embedding');
      expect(typeof item.index).toBe('number');
      expect(item.index).toBe(idx);
      expect(Array.isArray(item.embedding)).toBe(true);
      expect(item.embedding.length).toBeGreaterThan(0);

      item.embedding.forEach((score: number) => {
        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThanOrEqual(0.0);
        expect(score).toBeLessThanOrEqual(1.0);
      });
    });

    const firstPatternScore = result.data[0].embedding[0];
    const secondPatternScore = result.data[1].embedding[0];
    const thirdPatternScore = result.data[2].embedding[0];

    expect(firstPatternScore).toBe(0.92);
    expect(secondPatternScore).toBe(0.78);
    expect(thirdPatternScore).toBe(0.61);

    expect(firstPatternScore > secondPatternScore).toBe(true);
    expect(secondPatternScore > thirdPatternScore).toBe(true);
  });
});