import { evaluateDataQualityAndGenerateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-552: [edge] 営業指導方針決定機能 - データ品質スコアが空値のときスコア基準による判定がスキップされる
  test('should skip evaluatePatternRelevance when dataQualityScore is null and return top success patterns with brief explanation', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Direct outreach with needs assessment',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similarCases: [
          {
            caseId: 'CASE-001',
            industryType: 'Technology',
            dealSize: 500000,
            successRate: 0.92,
            approachTaken: 'Consultative selling',
          },
        ],
        matchScore: 0.88,
      }),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'Based on similar successful cases in the technology sector.'
      ),
    };

    const recommendationPatternMaster = [
      {
        patternId: 'PAT-TOP-001',
        pattern: 'Consultative selling with ROI focus',
        frequency: 145,
        successRate: 0.89,
        briefExplanation: 'Top pattern: ROI-focused approach',
      },
      {
        patternId: 'PAT-002',
        pattern: 'Solution-based selling',
        frequency: 89,
        successRate: 0.81,
        briefExplanation: 'Alternative: Solution-based approach',
      },
    ];

    const inputData = {
      customerName: 'Acme Corp',
      businessType: 'Technology',
      companySize: 'Medium',
      dealCondition: 'New strategic partnership',
      dataQualityScore: null,
    };

    // Act
    const result = evaluateDataQualityAndGenerateRecommendation(
      inputData,
      mockAIEngine,
      recommendationPatternMaster
    );

    // Assert
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(result).toEqual({
      recommendedPattern: {
        patternId: 'PAT-TOP-001',
        pattern: 'Consultative selling with ROI focus',
        successRate: 0.89,
        briefExplanation: 'Top pattern: ROI-focused approach',
      },
      confidenceScore: 85,
      reasoningExplanation: 'Based on similar successful cases in the technology sector.',
      dataQualityBypass: true,
    });
  });
});