import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordBasis } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockInsertedRecord: any = null;
  let mockDatabase: any;
  let mockAIEngine: any;

  beforeEach(() => {
    mockInsertedRecord = null;

    mockDatabase = {
      insertRecommendationPattern: jest.fn((record: any) => {
        mockInsertedRecord = { ...record };
        return Promise.resolve({ id: 'pattern_001', ...record });
      }),
    };

    mockAIEngine = {
      generateRecommendation: jest.fn(async () => ({
        recommendation_id: 'rec_001',
        customer_id: 'cust_123',
        deal_id: 'deal_456',
        proposed_approach: 'High-value customer engagement strategy',
        confidence_score: 75,
        basis_data: [],
      })),
      explainRecommendationReasoning: jest.fn(async () => 
        'Top matching success pattern: Direct executive engagement with ROI focus'
      ),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1044
  test('推奨根拠が0件の場合、簡略版の根拠情報が記録される', async () => {
    const recommendationInput = {
      recommendation_id: 'rec_001',
      customer_id: 'cust_123',
      deal_id: 'deal_456',
      proposed_approach: 'High-value customer engagement strategy',
      confidence_score: 75,
      basis_data: [],
    };

    const aiRecommendationResponse = {
      recommendation_id: 'rec_001',
      customer_id: 'cust_123',
      deal_id: 'deal_456',
      proposed_approach: 'High-value customer engagement strategy',
      confidence_score: 75,
      basis_data: [],
    };

    const simplifiedExplanation =
      'Top matching success pattern: Direct executive engagement with ROI focus';

    mockAIEngine.generateRecommendation.mockResolvedValueOnce(aiRecommendationResponse);
    mockAIEngine.explainRecommendationReasoning.mockResolvedValueOnce(simplifiedExplanation);

    await recordBasis(
      recommendationInput,
      mockDatabase,
      mockAIEngine
    );

    expect(mockInsertedRecord).not.toBeNull();
    expect(mockInsertedRecord.basis_type).toBe('simplified');
    expect(mockInsertedRecord.basis_content).toBe(simplifiedExplanation);
    expect(mockInsertedRecord.detail_patterns).toBeNull();
    expect(mockDatabase.insertRecommendationPattern).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});