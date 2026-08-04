import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1433
  test('適用可能性スコアが最大値のとき、推奨が最優先で表示される', async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(1.0),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            id: 'rec_001',
            patternId: 'pattern_max_score',
            relevanceScore: 1.0,
            approachName: '業界トップシェア企業向けプレミアム提案',
            applicableConditions: {
              industry: '製造業',
              employeeRange: '1000人以上',
              challenges: ['効率化', 'DX推進']
            },
            priority: 'highest',
            displayOrder: 0
          },
          {
            id: 'rec_002',
            patternId: 'pattern_medium_score',
            relevanceScore: 0.85,
            approachName: '中堅企業向けスタンダード提案',
            applicableConditions: {
              industry: '製造業',
              employeeRange: '500-1000人',
              challenges: ['効率化']
            },
            priority: 'high',
            displayOrder: 1
          },
          {
            id: 'rec_003',
            patternId: 'pattern_low_score',
            relevanceScore: 0.65,
            approachName: '小規模企業向けエントリー提案',
            applicableConditions: {
              industry: '製造業',
              employeeRange: '100-500人',
              challenges: ['コスト削減']
            },
            priority: 'medium',
            displayOrder: 2
          }
        ]
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    const inputCondition = {
      customerId: 'cust_12345',
      industry: '製造業',
      employeeRange: '1000人以上',
      businessChallenges: ['効率化', 'DX推進'],
      dealDescription: '新規システム導入による業務効率化',
      dealAmount: 5000000,
      dealStage: 'initial_contact'
    };

    const result = await generateRecommendation(inputCondition, mockAIRecommendationEngine);

    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0].relevanceScore).toBe(1.0);
    expect(result.recommendations[0].displayOrder).toBe(0);
    expect(result.recommendations[0].priority).toBe('highest');
    expect(result.recommendations[0].patternId).toBe('pattern_max_score');

    expect(result.recommendations[1].relevanceScore).toBe(0.85);
    expect(result.recommendations[1].displayOrder).toBe(1);

    expect(result.recommendations[2].relevanceScore).toBe(0.65);
    expect(result.recommendations[2].displayOrder).toBe(2);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(inputCondition);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});