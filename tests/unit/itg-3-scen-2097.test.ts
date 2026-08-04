import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2097
  test('成功パターンの適用可能性がスコア化される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patterns: [
          {
            patternId: 'PATTERN_A',
            name: 'パターンA',
            relevanceScore: 0.92,
            matchReasons: [
              '顧客の生産効率化課題と過去成功事例が合致',
              '予算規模5000万円が過去成功事例と適合'
            ]
          },
          {
            patternId: 'PATTERN_B',
            name: 'パターンB',
            relevanceScore: 0.78,
            matchReasons: [
              '顧客業種が製造業で部分的に合致'
            ]
          },
          {
            patternId: 'PATTERN_C',
            name: 'パターンC',
            relevanceScore: 0.45,
            matchReasons: [
              '意思決定者数が異なる'
            ]
          }
        ]
      })
    };

    const dealConditions = {
      customerIndustry: '製造業',
      businessChallenge: '生産効率化',
      budgetSize: 50000000,
      decisionMakerCount: 3
    };

    const proposalContent = {
      approach: '生産効率化ソリューション提案',
      expectedOutcome: 'コスト削減20%達成'
    };

    const result = await evaluatePatternRelevance(
      dealConditions,
      proposalContent,
      mockAIEngine
    );

    expect(result.recommendedPattern.relevanceScore).toBe(0.92);
    expect(result.recommendedPattern.name).toBe('パターンA');
    expect(result.recommendedPattern.matchReasons).toContain(
      '顧客の生産効率化課題と過去成功事例が合致'
    );
    expect(result.recommendedPattern.matchReasons).toContain(
      '予算規模5000万円が過去成功事例と適合'
    );
    expect(result.allPatterns).toHaveLength(3);
    expect(result.allPatterns[0].relevanceScore).toBe(0.92);
    expect(result.allPatterns[1].relevanceScore).toBe(0.78);
    expect(result.allPatterns[2].relevanceScore).toBe(0.45);
  });
});