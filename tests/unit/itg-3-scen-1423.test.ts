import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1423
  test('過去商談データが複数件のとき、AI推奨エンジンがすべてのパターンを検討する', () => {
    const pastDealData = [
      {
        dealId: 'DEAL001',
        industry: 'IT',
        customerSize: 'large',
        proposalContent: 'クラウド導入',
        outcome: 'success',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        dealId: 'DEAL002',
        industry: 'IT',
        customerSize: 'mid',
        proposalContent: 'デジタル化支援',
        outcome: 'success',
        timestamp: '2024-02-20T11:30:00Z',
      },
      {
        dealId: 'DEAL003',
        industry: 'Manufacturing',
        customerSize: 'mid',
        proposalContent: 'IoT導入',
        outcome: 'success',
        timestamp: '2024-03-10T09:15:00Z',
      },
      {
        dealId: 'DEAL004',
        industry: 'IT',
        customerSize: 'mid',
        proposalContent: 'DX推進コンサル',
        outcome: 'success',
        timestamp: '2024-04-05T14:45:00Z',
      },
      {
        dealId: 'DEAL005',
        industry: 'Finance',
        customerSize: 'mid',
        proposalContent: 'セキュリティ強化',
        outcome: 'success',
        timestamp: '2024-05-12T13:20:00Z',
      },
    ];

    const newDealCondition = {
      industry: 'IT',
      customerSize: 'mid',
      challenge: 'デジタル化',
    };

    let evaluatePatternRelevanceCallCount = 0;
    let explainRecommendationReasoningCallCount = 0;
    const relevanceScores: Record<string, number> = {
      DEAL001: 0.65,
      DEAL002: 0.92,
      DEAL003: 0.58,
      DEAL004: 0.88,
      DEAL005: 0.62,
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn((condition: typeof newDealCondition) => ({
        recommendations: [
          {
            patternId: 'DEAL002',
            relevanceScore: 0.92,
            explanation: 'IT業界・中堅企業でのデジタル化支援は過去高成約率',
          },
          {
            patternId: 'DEAL004',
            relevanceScore: 0.88,
            explanation: 'DX推進コンサルのアプローチが顧客課題と合致',
          },
          {
            patternId: 'DEAL001',
            relevanceScore: 0.65,
            explanation: 'クラウド導入は関連テーマだが顧客規模差異あり',
          },
          {
            patternId: 'DEAL005',
            relevanceScore: 0.62,
            explanation: 'セキュリティは付随的な課題として検討対象',
          },
          {
            patternId: 'DEAL003',
            relevanceScore: 0.58,
            explanation: 'Manufacturing業界は異なるが中堅規模で参考値',
          },
        ],
      })),
      findSimilarPatterns: jest.fn((condition: typeof newDealCondition) =>
        pastDealData.map((deal) => ({
          dealId: deal.dealId,
          relevanceScore: relevanceScores[deal.dealId],
        }))
      ),
      evaluatePatternRelevance: jest.fn((pattern: typeof pastDealData[0], condition: typeof newDealCondition) => {
        evaluatePatternRelevanceCallCount++;
        return relevanceScores[pattern.dealId];
      }),
      explainRecommendationReasoning: jest.fn((patterns: typeof pastDealData, scores: Record<string, number>) => {
        explainRecommendationReasoningCallCount++;
        return patterns.map((p) => ({
          dealId: p.dealId,
          reasoning: `Pattern ${p.dealId}: score ${scores[p.dealId]}`,
        }));
      }),
    };

    const result = generateRecommendation(
      newDealCondition,
      pastDealData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendations: [
        {
          patternId: 'DEAL002',
          relevanceScore: 0.92,
          explanation: 'IT業界・中堅企業でのデジタル化支援は過去高成約率',
        },
        {
          patternId: 'DEAL004',
          relevanceScore: 0.88,
          explanation: 'DX推進コンサルのアプローチが顧客課題と合致',
        },
        {
          patternId: 'DEAL001',
          relevanceScore: 0.65,
          explanation: 'クラウド導入は関連テーマだが顧客規模差異あり',
        },
        {
          patternId: 'DEAL005',
          relevanceScore: 0.62,
          explanation: 'セキュリティは付随的な課題として検討対象',
        },
        {
          patternId: 'DEAL003',
          relevanceScore: 0.58,
          explanation: 'Manufacturing業界は異なるが中堅規模で参考値',
        },
      ],
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newDealCondition);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(result.recommendations).toHaveLength(5);
    expect(result.recommendations[0].relevanceScore).toBe(0.92);
    expect(result.recommendations[1].relevanceScore).toBe(0.88);
    expect(result.recommendations[2].relevanceScore).toBe(0.65);
    expect(result.recommendations[3].relevanceScore).toBe(0.62);
    expect(result.recommendations[4].relevanceScore).toBe(0.58);
    expect(result.recommendations[0].patternId).toBe('DEAL002');
    expect(result.recommendations[1].patternId).toBe('DEAL004');
    expect(result.recommendations[2].patternId).toBe('DEAL001');
    expect(result.recommendations[3].patternId).toBe('DEAL005');
    expect(result.recommendations[4].patternId).toBe('DEAL003');
  });
});