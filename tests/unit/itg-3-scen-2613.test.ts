import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2613
  test('推奨提案アプローチの根拠となる過去商談データが存在する場合、その参照データが表示される', async () => {
    const recommendationInput = {
      customerIndustry: '製造業',
      dealSize: '5000万円以上',
      proposalType: 'DX推進支援',
    };

    const mockAIEngineResponse = {
      recommendedApproach: 'クラウドERP導入支援',
      referenceDealIds: ['DEAL-2024-001', 'DEAL-2024-015', 'DEAL-2024-032'],
      similarityScores: [0.92, 0.87, 0.81],
    };

    const mockExplanationResponse = {
      narrative:
        '過去3件の同業種大型DX案件で同様のアプローチを適用し、成約率92%を達成。特にDEAL-2024-001では初期ヒアリングから提案まで2週間で完結し、顧客満足度9.2/10を記録',
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockAIEngineResponse),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockExplanationResponse),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendedApproach: 'クラウドERP導入支援',
      reasoningSection: {
        referenceDataItems: [
          {
            dealId: 'DEAL-2024-001',
            similarityScore: 0.92,
          },
          {
            dealId: 'DEAL-2024-015',
            similarityScore: 0.87,
          },
          {
            dealId: 'DEAL-2024-032',
            similarityScore: 0.81,
          },
        ],
        narrative:
          '過去3件の同業種大型DX案件で同様のアプローチを適用し、成約率92%を達成。特にDEAL-2024-001では初期ヒアリングから提案まで2週間で完結し、顧客満足度9.2/10を記録',
        navigationEnabled: true,
      },
    });

    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedApproach: 'クラウドERP導入支援',
        referenceDealIds: ['DEAL-2024-001', 'DEAL-2024-015', 'DEAL-2024-032'],
        similarityScores: [0.92, 0.87, 0.81],
      })
    );
  });
});