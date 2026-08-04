import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

// Mock for AIRecommendationEngine
interface MockAIEngine {
  generateRecommendation: jest.Mock;
  findSimilarPatterns: jest.Mock;
  explainRecommendationReasoning: jest.Mock;
  evaluatePatternRelevance: jest.Mock;
}

// Mock for internal pattern master
interface RecommendationPattern {
  pattern_id: string;
  success_rate: number;
  past_case_count: number;
  description: string;
}

describe('AIエージェント推奨根拠の可視化機能 - 外部AI失敗時の代替表示', () => {
  let mockAIEngine: MockAIEngine;
  let internalPatternMaster: RecommendationPattern[];

  beforeEach(() => {
    // Initialize mock AI engine with all methods failing
    mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('External API call failed')
      ),
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error('External API call failed')
      ),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('External API call failed')
      ),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('External API call failed')
      ),
    };

    // Prepare internal recommendation pattern master
    internalPatternMaster = [
      {
        pattern_id: 'PATTERN_A',
        success_rate: 85,
        past_case_count: 120,
        description: '過去の成功事例に基づく推奨',
      },
      {
        pattern_id: 'PATTERN_B',
        success_rate: 72,
        past_case_count: 85,
        description: '類似案件からの推奨',
      },
      {
        pattern_id: 'PATTERN_C',
        success_rate: 68,
        past_case_count: 60,
        description: '業種別の推奨',
      },
    ];
  });

  // SCEN-1538
  test('should display fallback recommendation pattern from internal master when external AI engine fails after 3 exponential backoff retries within 30 second timeout', async () => {
    const dealCondition = {
      customer_industry: '製造業',
      deal_amount: 5000000,
      decision_maker_count: 3,
    };

    const startTime = Date.now();

    const result = await visualizeRecommendationReasoning(
      dealCondition,
      mockAIEngine,
      internalPatternMaster
    );

    const elapsedTime = Date.now() - startTime;

    // Verify exponential backoff retries were attempted
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // Verify response completes within 30 second timeout
    expect(elapsedTime).toBeLessThanOrEqual(30000);

    // Verify user-facing message
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // Verify fallback recommendation is the statistically highest pattern (Pattern A: 85% success rate)
    expect(result.fallback_pattern.pattern_id).toBe('PATTERN_A');
    expect(result.fallback_pattern.success_rate).toBe(85);
    expect(result.fallback_pattern.past_case_count).toBe(120);

    // Verify simplified reasoning explanation
    expect(result.reasoning_explanation).toBe('過去の成功事例に基づく推奨');

    // Verify retry UI is provided
    expect(result.retry_button_available).toBe(true);

    // Verify error details are logged
    expect(result.error_details).toBeDefined();
    expect(result.error_details.retry_attempts).toBe(3);
    expect(result.error_details.last_error_message).toContain(
      'External API call failed'
    );
  });
});