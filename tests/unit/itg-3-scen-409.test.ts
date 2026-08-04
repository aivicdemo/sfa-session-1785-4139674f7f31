import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - OpenAI API失敗時の代替動作', () => {
  // SCEN-409
  test('OpenAI API失敗時に内部パターンマスタから統計上位パターンを使用した推奨を生成', async () => {
    const mockInternalPatterns = [
      {
        patternId: 'pattern_A',
        successRate: 80,
        caseCount: 150,
        description: 'アプローチA',
      },
      {
        patternId: 'pattern_B',
        successRate: 75,
        caseCount: 120,
        description: 'アプローチB',
      },
      {
        patternId: 'pattern_C',
        successRate: 70,
        caseCount: 100,
        description: 'アプローチC',
      },
    ];

    let apiCallCount = 0;
    const mockAIEngine = {
      generateRecommendation: jest.fn(async () => {
        apiCallCount++;
        const error = new Error('Request timeout');
        (error as any).code = 'ETIMEDOUT';
        throw error;
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealData = {
      customerIndustry: 'manufacturing',
      budgetScale: 10000000,
      decisionMakerCount: 3,
    };

    const result = await generateRecommendationWithFallback(
      dealData,
      mockAIEngine,
      mockFileStorage,
      mockInternalPatterns
    );

    expect(apiCallCount).toBe(3);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(result.recommendedPattern.patternId).toBe('pattern_A');
    expect(result.recommendedPattern.successRate).toBe(80);
    expect(result.recommendedPattern.caseCount).toBe(150);

    expect(result.reasoning).toMatch(/過去の類似案件で最も成功率の高いアプローチです/);

    expect(result.userMessage).toMatch(
      /推奨の生成に一時的な遅延が発生しています/
    );
    expect(result.userMessage).toMatch(/過去の推奨履歴から類似案件を表示します/);

    expect(result.isFallback).toBe(true);
  });
});