import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - AIエージェント呼び出し失敗時の代替動作', () => {
  // SCEN-1802
  test('AIエージェント呼び出し失敗時、内部推奨パターンマスタから統計的に上位の成功パターンが返却される', async () => {
    const newCaseData = {
      customerId: 'CUST-001',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealAmount: 5000000,
      dealStage: '提案準備',
      dealConditions: {
        budget: 6000000,
        timeline: '3ヶ月以内',
        decisionMaker: '経営層',
      },
    };

    const failingAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('API connection timeout')
      ),
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error('API connection timeout')
      ),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API connection timeout')
      ),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('API connection timeout')
      ),
    };

    const result = await generateRecommendation(newCaseData, failingAIEngine);

    expect(result).toBeDefined();
    expect(result.fallbackMode).toBe(true);
    expect(Array.isArray(result.recommendedPatterns)).toBe(true);
    expect(result.recommendedPatterns.length).toBeGreaterThan(0);
    expect(result.recommendedPatterns.length).toBeLessThanOrEqual(3);

    expect(result.recommendedPatterns[0]).toMatchObject({
      patternId: expect.any(String),
      approach: expect.any(String),
      successRate: expect.any(Number),
      rank: expect.any(Number),
    });

    const topPattern = result.recommendedPatterns[0];
    expect(topPattern.successRate).toBeGreaterThanOrEqual(0.85);

    expect(result.recommendedPatterns.every(p => p.successRate >= 0.85)).toBe(
      true
    );

    const sortedByRank = [...result.recommendedPatterns].sort(
      (a, b) => a.rank - b.rank
    );
    expect(result.recommendedPatterns).toEqual(sortedByRank);

    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning).toMatch(/成功率/);
    expect(result.reasoning).not.toMatch(/embedding/i);
    expect(result.reasoning).not.toMatch(/機械学習/);

    expect(failingAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(result.fallbackMessage).toBeDefined();
    expect(result.fallbackMessage).toMatch(/推奨の生成に一時的な遅延/);
  });
});