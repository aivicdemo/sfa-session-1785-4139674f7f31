import { describe, test, expect, beforeEach } from '@jest/globals';
import type { AIRecommendationEngine } from '../../src/types/AIRecommendationEngine';
import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  test('SCEN-2385: 提案内容パターンデータがnullのとき、ValidationErrorが発生する', () => {
    // Arrange
    const nullPatternData = null;
    const mockStandardProcess = {
      processId: 'PROC-001',
      steps: ['initial', 'analysis', 'proposal'],
      successRate: 0.75,
    };

    mockAIEngine.evaluatePatternRelevance.mockResolvedValue({
      score: 0,
      isApplicable: false,
    });

    // Act & Assert
    expect(() => {
      calculateInferenceAccuracyScore(
        nullPatternData,
        mockStandardProcess,
        mockAIEngine
      );
    }).toThrow(/パターンデータ/);
  });
});