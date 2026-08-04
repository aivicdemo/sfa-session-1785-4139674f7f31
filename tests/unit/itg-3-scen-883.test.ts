import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-883
  test('推奨根拠データの提示機能 - 根拠データが1件のとき単一の根拠が営業担当者に提示される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const similarPatternsResponse = {
      patterns: [
        {
          patternId: 'PAT-2024-001',
          customerIndustry: '製造業',
          dealAmount: '500万円',
          successRate: 92,
          applicabilityScore: 0.95,
        },
      ],
    };

    const reasoningExplanationResponse = {
      explanation: '過去同業種で同規模商談において提案アプローチAが92%の成約率を達成しています',
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue(
      similarPatternsResponse
    );
    mockAIRecommendationEngine.explainRecommendationReasoning.mockResolvedValue(
      reasoningExplanationResponse
    );

    const recommendationResult = {
      recommendationId: 'REC-2024-001',
      proposalApproach: 'アプローチA',
      confidenceScore: 85,
      reasoningExplanation:
        '過去同業種で同規模商談において提案アプローチAが92%の成約率を達成しています',
      evidenceData: [
        {
          patternId: 'PAT-2024-001',
          customerIndustry: '製造業',
          dealAmount: '500万円',
          successRate: 92,
          applicabilityScore: 0.95,
        },
      ],
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(
      recommendationResult
    );

    const newDealInput = {
      customerIndustry: '製造業',
      estimatedAmount: '480万円',
      dealStage: '初期段階',
    };

    const result = generateRecommendation(
      newDealInput,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('evidenceData');
    expect(Array.isArray(result.evidenceData)).toBe(true);
    expect(result.evidenceData.length).toBe(1);

    const firstEvidence = result.evidenceData[0];
    expect(firstEvidence.patternId).toBe('PAT-2024-001');
    expect(firstEvidence.applicabilityScore).toBe(0.95);
    expect(firstEvidence.successRate).toBe(92);

    expect(result.reasoningExplanation).toContain(
      '過去同業種で同規模商談において提案アプローチAが92%の成約率を達成しています'
    );

    const displayCard = {
      cardCount: result.evidenceData.length,
      patternId: result.evidenceData[0].patternId,
      successRate: result.evidenceData[0].successRate,
      applicabilityScore: result.evidenceData[0].applicabilityScore,
      explanation: result.reasoningExplanation,
    };

    expect(displayCard.cardCount).toBe(1);
    expect(displayCard.patternId).toBe('PAT-2024-001');
    expect(displayCard.successRate).toBe(92);
    expect(displayCard.applicabilityScore).toBe(0.95);
    expect(displayCard.explanation).toBe(
      '過去同業種で同規模商談において提案アプローチAが92%の成約率を達成しています'
    );
  });
});