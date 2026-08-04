import { validateLearningDataVolume } from '../../src/logic/it-1-br-3-3-2-1';

describe('Learning Data Volume Validation', () => {
  // SCEN-129: [edge] 学習データ量検証機能 - 学習データが0件で検証が保留される
  test('should return PENDING status when learning data is empty', async () => {
    const emptyLearningDataStore: Array<{
      id: string;
      dealId: string;
      customerIndustry: string;
      dealAmount: number;
      dealStage: string;
      proposalApproach: string;
      result: 'won' | 'lost';
      createdAt: Date;
    }> = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const currentDateTime = new Date('2024-01-15T11:00:00Z');
    const nextCheckScheduled = new Date('2024-01-22T11:00:00Z');

    const result = await validateLearningDataVolume(
      emptyLearningDataStore,
      mockAIRecommendationEngine,
      currentDateTime
    );

    expect(result.status).toBe('PENDING');
    expect(result.reason).toBe('Insufficient learning data');
    expect(result.dataCount).toBe(0);
    expect(result.requiredMinimum).toBe(1);
    expect(result.nextCheckScheduled).toEqual(nextCheckScheduled);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});