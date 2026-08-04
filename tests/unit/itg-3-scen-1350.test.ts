import { describe, test, expect, beforeEach } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1350
  test('推奨根拠データが0件のとき、根拠説明なしとして処理される', () => {
    const customerId = 'CUST-001';
    const dealCondition = {
      dealId: 'DEAL-20240115-001',
      customerIndustry: 'manufacturing',
      customerScale: 'enterprise',
      dealStage: 'proposal',
      estimatedAmount: 5000000,
    };
    const caseInfo = {
      caseId: 'CASE-2024-001',
      productCategory: 'cloud_erp',
      solutionType: 'digital_transformation',
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: '',
        reasoningDataList: [],
        hasReasoning: false,
        confidenceScore: 0,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'default_approach',
        patterns: [],
      }),
    };

    const result = visualizeRecommendationReasoning(
      customerId,
      dealCondition,
      caseInfo,
      mockAIEngine
    );

    expect(result.reasoningExplanation).toBe('');
    expect(result.reasoningDataList).toEqual([]);
    expect(result.hasReasoning).toBe(false);
    expect(result.uiVisualizationMessage).toBe('根拠データはありません');
    expect(result.confidenceScore).toBe(0);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId,
        dealId: dealCondition.dealId,
      })
    );
  });
});