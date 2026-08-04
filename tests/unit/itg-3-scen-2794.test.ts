import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

fetchMock.enableMocks();

describe('Success Pattern Extraction with Weighting Logic', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // SCEN-2794
  test('should return error with fallback pattern when AIRecommendationEngine returns 500 after max retries', async () => {
    const newDealCondition = {
      customer_id: 'CUST-20240115-001',
      customer_industry: 'manufacturing',
      customer_scale: 'large',
      deal_amount: 5000000,
      product_category: 'ERP_system',
      sales_stage: 'proposal'
    };

    const mockAIEngineWithRetry = jest.fn()
      .mockRejectedValueOnce(new Error('HTTP 500: Internal Server Error'))
      .mockRejectedValueOnce(new Error('HTTP 500: Internal Server Error'))
      .mockRejectedValueOnce(new Error('HTTP 500: Internal Server Error'));

    const fallbackPatterns = [
      {
        pattern_id: 'PAT-2024-001',
        customer_industry: 'manufacturing',
        customer_scale: 'large',
        product_category: 'ERP_system',
        success_rate: 0.82,
        recommendation_text: 'Standard ERP implementation approach',
        confidence_score: 75
      },
      {
        pattern_id: 'PAT-2024-002',
        customer_industry: 'manufacturing',
        customer_scale: 'large',
        product_category: 'ERP_system',
        success_rate: 0.78,
        recommendation_text: 'Phased ERP rollout strategy',
        confidence_score: 70
      }
    ];

    let retryCount = 0;
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(async () => {
        retryCount++;
        if (retryCount <= 3) {
          throw new Error('HTTP 500: Internal Server Error');
        }
        return null;
      })
    };

    const result = await extractSuccessPatternsWithWeighting(
      newDealCondition,
      mockRecommendationEngine,
      fallbackPatterns
    );

    expect(result).toEqual({
      status: 'error',
      statusCode: 500,
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallback_patterns: [
        {
          pattern_id: 'PAT-2024-001',
          customer_industry: 'manufacturing',
          customer_scale: 'large',
          product_category: 'ERP_system',
          success_rate: 0.82,
          recommendation_text: 'Standard ERP implementation approach',
          confidence_score: 75
        },
        {
          pattern_id: 'PAT-2024-002',
          customer_industry: 'manufacturing',
          customer_scale: 'large',
          product_category: 'ERP_system',
          success_rate: 0.78,
          recommendation_text: 'Phased ERP rollout strategy',
          confidence_score: 70
        }
      ],
      explanation_brief: 'Top success patterns from historical data'
    });

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});