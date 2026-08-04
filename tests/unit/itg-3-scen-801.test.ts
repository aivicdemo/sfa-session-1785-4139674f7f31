import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-801
  test('[normal] 推奨内容と根拠の統合提示機能 - 推奨内容と根拠が同一の統合オブジェクトで返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: {
          approach: 'IT業界向けDX支援パッケージ提案',
          productName: 'クラウド統合ソリューション'
        },
        reasoning: {
          similarityScore: 0.87,
          matchedPatternCount: 3,
          relevanceEvaluation: 0.92
        },
        integratedAt: '2024-01-15T11:30:00Z'
      })
    };

    const customerInfo = {
      industry: 'IT',
      companySize: '中堅企業'
    };

    const dealConditions = {
      budget: 5000000,
      decisionDeadline: 30
    };

    const result = await generateRecommendationWithReasoning(
      customerInfo,
      dealConditions,
      mockAIEngine
    );

    expect(result).toEqual({
      recommendation: {
        approach: 'IT業界向けDX支援パッケージ提案',
        productName: 'クラウド統合ソリューション'
      },
      reasoning: {
        similarityScore: 0.87,
        matchedPatternCount: 3,
        relevanceEvaluation: 0.92
      },
      integratedAt: '2024-01-15T11:30:00Z'
    });

    expect(result.recommendation).toBeDefined();
    expect(result.reasoning).toBeDefined();
    expect(result.integratedAt).toBeDefined();

    expect(result.recommendation.approach).toBe('IT業界向けDX支援パッケージ提案');
    expect(result.recommendation.productName).toBe('クラウド統合ソリューション');
    expect(result.reasoning.similarityScore).toBe(0.87);
    expect(result.reasoning.matchedPatternCount).toBe(3);
    expect(result.reasoning.relevanceEvaluation).toBe(0.92);
    expect(result.integratedAt).toBe('2024-01-15T11:30:00Z');

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealConditions
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});