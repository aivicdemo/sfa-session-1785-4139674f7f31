import { validateLearningDataVolume } from '../../src/logic/it-1-br-3-3-2-1';

describe('Learning Data Volume Validation - Edge Case', () => {
  // SCEN-127
  test('should return VALIDATION_PENDING status when learning data is just below minimum requirement', () => {
    const minimumRequiredVolume = 1000;
    const inputDataVolume = 999;
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const validationInput = {
      learningDataVolume: inputDataVolume,
      minimumRequiredVolume: minimumRequiredVolume,
      aiEngine: mockAIEngine,
    };

    const result = validateLearningDataVolume(validationInput);

    expect(result.status).toBe('VALIDATION_PENDING');
    expect(result.errorMessage).toBeUndefined();
    expect(result.internalStatus).toBe('pending_validation');
    expect(result.userNotification).toBe(
      '学習データ量が基準に達していないため、推奨生成を保留中です'
    );
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(result.recommendationProcessStarted).toBe(false);
  });
});