import { describe, test, expect, beforeEach } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-284
  test('推奨根拠テーブルに記録された根拠情報が1件のとき、その根拠が単独で可視化される', () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const singleReasonRecord = {
      reasonId: 'R001',
      category: '過去成功事例',
      description: '同業種・同規模顧客への提案成功率82%',
      confidenceScore: 0.82,
    };

    const mockRecommendationResult = {
      recommendationId: 'REC-12345',
      proposedApproach: '提案アプローチA',
      recommendationReasons: [singleReasonRecord],
      confidenceScore: 0.82,
      timestamp: '2024-01-15T11:00:00Z',
    };

    mockRecommendationEngine.generateRecommendation.mockReturnValue(
      mockRecommendationResult
    );

    const newProjectData = {
      customerId: 'C001',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealCondition: '新規提案',
      dealAmount: 5000000,
      dealStage: '初期提案',
    };

    const visualizationResult = visualizeRecommendationReasoning(
      mockRecommendationEngine,
      mockRecommendationResult.recommendationReasons,
      newProjectData
    );

    expect(visualizationResult).toBeDefined();
    expect(visualizationResult.reasonsCount).toBe(1);
    expect(visualizationResult.reasons).toHaveLength(1);

    const displayedReason = visualizationResult.reasons[0];
    expect(displayedReason.reasonId).toBe('R001');
    expect(displayedReason.category).toBe('過去成功事例');
    expect(displayedReason.description).toBe('同業種・同規模顧客への提案成功率82%');
    expect(displayedReason.confidenceScore).toBe(0.82);

    expect(visualizationResult.isVisualized).toBe(true);
    expect(visualizationResult.visualizationType).toBe('single');
  });
});