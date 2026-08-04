import { generateRecommendationWithReasoningDisplay } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1918: 根拠データが降順で並ぶときに正しく返却される', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: 'rec-20260801-001',
        explanationText: 'SaaS企業500万円以上の案件は、クラウド導入パターンが適用できます',
        reasoningBasis: [
          {
            relevanceScore: 0.95,
            description: '過去12ヶ月の同業種・同規模での成約事例',
            referenceExampleId: 'ex-2024-0152',
          },
          {
            relevanceScore: 0.87,
            description: '業種別成功パターンマッチング',
            referenceExampleId: 'ex-2024-0098',
          },
          {
            relevanceScore: 0.72,
            description: '商談金額帯別の推奨提案アプローチ',
            referenceExampleId: 'ex-2024-0045',
          },
          {
            relevanceScore: 0.65,
            description: '営業タイミング最適化パターン',
            referenceExampleId: 'ex-2023-0301',
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      industry: 'SaaS',
      dealAmount: 5000000,
      dealStage: 'proposal_preparation',
      customerId: 'cust-20260801-A001',
    };

    // Act
    const result = generateRecommendationWithReasoningDisplay(
      dealCondition,
      mockAIEngine
    );

    // Assert
    expect(result).toEqual({
      recommendationId: 'rec-20260801-001',
      proposalApproach: 'SaaS企業500万円以上の案件は、クラウド導入パターンが適用できます',
      displayedReasoningBasis: [
        {
          relevanceScore: 0.95,
          description: '過去12ヶ月の同業種・同規模での成約事例',
          referenceExampleId: 'ex-2024-0152',
          sequenceIndex: 0,
        },
        {
          relevanceScore: 0.87,
          description: '業種別成功パターンマッチング',
          referenceExampleId: 'ex-2024-0098',
          sequenceIndex: 1,
        },
        {
          relevanceScore: 0.72,
          description: '商談金額帯別の推奨提案アプローチ',
          referenceExampleId: 'ex-2024-0045',
          sequenceIndex: 2,
        },
        {
          relevanceScore: 0.65,
          description: '営業タイミング最適化パターン',
          referenceExampleId: 'ex-2023-0301',
          sequenceIndex: 3,
        },
      ],
      internalReasoningBasis: [
        {
          relevanceScore: 0.95,
          description: '過去12ヶ月の同業種・同規模での成約事例',
          referenceExampleId: 'ex-2024-0152',
        },
        {
          relevanceScore: 0.87,
          description: '業種別成功パターンマッチング',
          referenceExampleId: 'ex-2024-0098',
        },
        {
          relevanceScore: 0.72,
          description: '商談金額帯別の推奨提案アプローチ',
          referenceExampleId: 'ex-2024-0045',
        },
        {
          relevanceScore: 0.65,
          description: '営業タイミング最適化パターン',
          referenceExampleId: 'ex-2023-0301',
        },
      ],
    });

    // Verify that the reasoningBasis arrays maintain descending order
    expect(result.displayedReasoningBasis[0].relevanceScore).toBeGreaterThan(
      result.displayedReasoningBasis[1].relevanceScore
    );
    expect(result.displayedReasoningBasis[1].relevanceScore).toBeGreaterThan(
      result.displayedReasoningBasis[2].relevanceScore
    );
    expect(result.displayedReasoningBasis[2].relevanceScore).toBeGreaterThan(
      result.displayedReasoningBasis[3].relevanceScore
    );

    // Verify internal array also maintains descending order
    expect(result.internalReasoningBasis[0].relevanceScore).toBe(0.95);
    expect(result.internalReasoningBasis[1].relevanceScore).toBe(0.87);
    expect(result.internalReasoningBasis[2].relevanceScore).toBe(0.72);
    expect(result.internalReasoningBasis[3].relevanceScore).toBe(0.65);

    // Verify that explainRecommendationReasoning was called with correct parameters
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      dealCondition
    );
  });
});