import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockAIEngine: any;

  beforeEach(() => {
    mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };
  });

  // SCEN-286
  test('推奨根拠の信頼度スコアがちょうど表示閾値と一致するとき、その根拠が可視化対象に含まれる', () => {
    const CONFIDENCE_THRESHOLD = 0.70;
    const targetConfidenceScore = 0.70;

    const recommendationResult = {
      rationales: [
        {
          rationalId: 'rationale_001',
          confidenceScore: targetConfidenceScore,
          explanation: '過去の類似顧客パターンに基づいた推奨',
          sourceData: {
            similarCaseCount: 5,
            successRate: 0.82,
          },
        },
        {
          rationalId: 'rationale_002',
          confidenceScore: 0.65,
          explanation: '業種別の成功パターンマッチング',
          sourceData: {
            industryMatchCount: 3,
            matchPercentage: 0.75,
          },
        },
      ],
    };

    mockAIEngine.evaluatePatternRelevance.mockReturnValue({
      score: targetConfidenceScore,
      isReliable: true,
    });

    const visualizedRationales = visualizeRecommendationRationale(
      recommendationResult,
      CONFIDENCE_THRESHOLD,
      mockAIEngine
    );

    expect(visualizedRationales).toHaveLength(1);
    expect(visualizedRationales[0]).toEqual({
      rationalId: 'rationale_001',
      confidenceScore: 0.70,
      explanation: '過去の類似顧客パターンに基づいた推奨',
      sourceData: {
        similarCaseCount: 5,
        successRate: 0.82,
      },
      isVisible: true,
    });
    expect(visualizedRationales[0].confidenceScore).toBe(0.70);
    expect(visualizedRationales[0].isVisible).toBe(true);
  });
});