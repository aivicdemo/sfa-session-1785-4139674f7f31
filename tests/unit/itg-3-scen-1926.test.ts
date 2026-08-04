import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1926
  test('成功パターンマッチ件数が0件のときにAIエージェント外部呼び出しが代替動作へ遷移する', () => {
    const stubAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCase = {
      customerIndustry: 'IT',
      budgetAmount: 5000000,
      decisionTimeline: '3ヶ月以内',
    };

    const result = visualizeRecommendationReasoning(newCase, stubAIEngine);

    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCase);
    expect(stubAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(stubAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(result.patterns).toEqual([
      {
        patternId: 'internal_pat_001',
        industry: 'IT',
        successRate: 0.78,
        yearsOfData: 3,
      },
      {
        patternId: 'internal_pat_002',
        industry: 'IT',
        successRate: 0.72,
        yearsOfData: 3,
      },
      {
        patternId: 'internal_pat_003',
        industry: 'IT',
        successRate: 0.68,
        yearsOfData: 3,
      },
    ]);

    expect(result.reasoning).toBe('過去の統計データに基づいた推奨です');

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.isAlternativeMode).toBe(true);
  });
});