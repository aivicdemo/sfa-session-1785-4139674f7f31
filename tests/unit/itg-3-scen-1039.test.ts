import { evaluateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の妥当性評価 - スコア0.0の場合', () => {
  test('SCEN-1039: スコア0.0のとき推奨は見送られ、推奨情報が保存されない', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
    };

    const newProjectInput = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      dealAmount: 5000000,
      dealStage: '初期提案',
      dealTimeline: '2024-03-31',
      dealContext: {
        customerPainPoint: '生産効率化',
        competitorName: 'CompetitorA',
        decisionMaker: 'CTO',
      },
    };

    const recommendationRecord = {
      recommendationId: '',
      dealId: 'DEAL-20240115-001',
      customerId: newProjectInput.customerId,
      recommendationContent: null,
      confidenceScore: 0.0,
      recommendationStatus: 'SKIPPED' as const,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      savedToDatabase: false,
      reasoningExplanationExecuted: false,
    };

    // Act
    const result = evaluateRecommendation(newProjectInput, mockAIEngine);

    // Assert
    expect(result.confidenceScore).toBe(0.0);
    expect(result.recommendationStatus).toBe('SKIPPED');
    expect(result.recommendationContent).toBeNull();
    expect(result.savedToDatabase).toBe(false);
    expect(result.reasoningExplanationExecuted).toBe(false);
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(newProjectInput);
  });
});