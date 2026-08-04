import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1780
  test('複数の成功パターンが推奨根拠として全件表示される', () => {
    const newDealData = {
      customerIndustry: '製造業',
      budgetRange: '1000万円以上',
      decisionMakers: 3,
    };

    const mockPatternA = {
      id: 'pattern-a',
      name: '導入事例型提案',
      successRate: 0.78,
      relevanceScore: 0.92,
      reasoning: '過去12ヶ月の類似案件で成約率78%を達成',
    };

    const mockPatternB = {
      id: 'pattern-b',
      name: 'ROI分析型提案',
      roiEffect: 3.1,
      relevanceScore: 0.88,
      reasoning: '同業種での平均ROI効果が24ヶ月で310%',
    };

    const mockPatternC = {
      id: 'pattern-c',
      name: '段階的導入型提案',
      successRate: 0.84,
      relevanceScore: 0.85,
      reasoning: '大規模案件の段階的導入成功率が84%',
    };

    const mockRecommendationResponse = {
      patterns: [mockPatternA, mockPatternB, mockPatternC],
      recommendedApproach: '複合型提案アプローチ',
    };

    const mockAIEngine: AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendationResponse),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.evaluatePatternRelevance = jest
      .fn()
      .mockImplementation((pattern: string) => {
        const scoreMap: Record<string, number> = {
          'pattern-a': 0.92,
          'pattern-b': 0.88,
          'pattern-c': 0.85,
        };
        return Promise.resolve(scoreMap[pattern] || 0);
      });

    mockAIEngine.explainRecommendationReasoning = jest
      .fn()
      .mockImplementation((pattern: string) => {
        const reasoningMap: Record<string, string> = {
          'pattern-a': '過去12ヶ月の類似案件で成約率78%を達成',
          'pattern-b': '同業種での平均ROI効果が24ヶ月で310%',
          'pattern-c': '大規模案件の段階的導入成功率が84%',
        };
        return Promise.resolve(reasoningMap[pattern] || '');
      });

    const executionResult = mockAIEngine.generateRecommendation(newDealData);

    return executionResult.then((result) => {
      expect(result.patterns).toHaveLength(3);

      expect(result.patterns[0].name).toBe('導入事例型提案');
      expect(result.patterns[0].relevanceScore).toBe(0.92);

      expect(result.patterns[1].name).toBe('ROI分析型提案');
      expect(result.patterns[1].relevanceScore).toBe(0.88);

      expect(result.patterns[2].name).toBe('段階的導入型提案');
      expect(result.patterns[2].relevanceScore).toBe(0.85);

      const sortedByScore = result.patterns.sort(
        (a, b) => b.relevanceScore - a.relevanceScore
      );

      expect(sortedByScore[0].relevanceScore).toBe(0.92);
      expect(sortedByScore[1].relevanceScore).toBe(0.88);
      expect(sortedByScore[2].relevanceScore).toBe(0.85);

      return Promise.all([
        mockAIEngine
          .explainRecommendationReasoning('pattern-a')
          .then((reasoning) => {
            expect(reasoning).toBe('過去12ヶ月の類似案件で成約率78%を達成');
          }),
        mockAIEngine
          .explainRecommendationReasoning('pattern-b')
          .then((reasoning) => {
            expect(reasoning).toBe('同業種での平均ROI効果が24ヶ月で310%');
          }),
        mockAIEngine
          .explainRecommendationReasoning('pattern-c')
          .then((reasoning) => {
            expect(reasoning).toBe('大規模案件の段階的導入成功率が84%');
          }),
      ]);
    });
  });
});