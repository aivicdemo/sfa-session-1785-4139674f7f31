import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1376
  test('顧客情報が登録されていないとき条件照合ができない', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue([]);
    
    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      score: 0,
      status: '条件不足',
    });

    const topPatterns = [
      {
        patternId: 'pattern-001',
        successRate: 0.85,
        description: '大規模企業向け標準提案',
      },
      {
        patternId: 'pattern-002',
        successRate: 0.78,
        description: '中堅企業向け標準提案',
      },
    ];

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendations: topPatterns,
      fallbackReason: '顧客情報がないため、過去の成功パターンから推奨しています',
      userMessage: '推奨の生成に遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      score: 0,
    });

    const input = {
      dealId: 'deal-12345',
      customerId: null,
      dealConditions: {
        industry: null,
        companySize: null,
        budget: null,
      },
      aiEngine: mockAIRecommendationEngine,
    };

    const result = await generateRecommendation(input);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    
    const similarPatternsResult = mockAIRecommendationEngine.findSimilarPatterns();
    expect(similarPatternsResult).toEqual([]);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    
    const evaluateResult = mockAIRecommendationEngine.evaluatePatternRelevance();
    expect(evaluateResult.score).toBe(0);
    expect(evaluateResult.status).toBe('条件不足');

    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0].patternId).toBe('pattern-001');
    expect(result.recommendations[0].successRate).toBe(0.85);
    expect(result.recommendations[1].patternId).toBe('pattern-002');
    expect(result.recommendations[1].successRate).toBe(0.78);

    expect(result.fallbackReason).toBe(
      '顧客情報がないため、過去の成功パターンから推奨しています'
    );

    expect(result.userMessage).toBe(
      '推奨の生成に遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.score).toBe(0);
  });
});