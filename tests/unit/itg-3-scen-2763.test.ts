import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { extractSuccessPatternAndGenerateWeightingRule } from '../../src/logic/it-1-br-3-3-2-1';

describe('it-1-br-3-3-2-1: 成功パターン抽出・重み付けルール生成機能', () => {
  let mockAIEngine: any;
  let mockPatternRepository: any;

  beforeEach(() => {
    mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockPatternRepository = {
      save: jest.fn(),
    };
  });

  // SCEN-2763
  test('成功商談のみの場合、成功パターンの特徴量が重み付けの基準として抽出される', async () => {
    const successfulDeals = [
      {
        deal_id: 'DEAL001',
        customer_industry: 'manufacturing',
        deal_amount: 5000000,
        proposal_period_days: 30,
        contact_count: 8,
        contract_status: 'won',
      },
      {
        deal_id: 'DEAL002',
        customer_industry: 'manufacturing',
        deal_amount: 4800000,
        proposal_period_days: 28,
        contact_count: 7,
        contract_status: 'won',
      },
      {
        deal_id: 'DEAL003',
        customer_industry: 'manufacturing',
        deal_amount: 5200000,
        proposal_period_days: 32,
        contact_count: 9,
        contract_status: 'won',
      },
    ];

    const mockEmbeddings = [
      [0.1, 0.2, 0.3, 0.4],
      [0.15, 0.22, 0.32, 0.38],
      [0.12, 0.19, 0.31, 0.42],
    ];

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      patterns: [
        {
          feature_name: 'customer_industry',
          relevance_score: 0.95,
        },
        {
          feature_name: 'deal_amount',
          relevance_score: 0.87,
        },
        {
          feature_name: 'proposal_period_days',
          relevance_score: 0.82,
        },
        {
          feature_name: 'contact_count',
          relevance_score: 0.79,
        },
      ],
      embeddings: mockEmbeddings,
    });

    mockAIEngine.evaluatePatternRelevance.mockResolvedValue(0.88);

    const mockRepository = {
      save: jest.fn().mockResolvedValue({
        rule_id: 'RULE001',
        weighting_rule: {
          customer_industry: 0.95,
          deal_amount: 0.87,
          proposal_period_days: 0.82,
          contact_count: 0.79,
        },
        created_at: '2024-01-15T11:00:00Z',
      }),
    };

    const result = await extractSuccessPatternAndGenerateWeightingRule(
      successfulDeals,
      mockAIEngine,
      mockRepository
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(successfulDeals);

    expect(result.rule_id).toBe('RULE001');
    expect(result.weighting_rule).toEqual({
      customer_industry: 0.95,
      deal_amount: 0.87,
      proposal_period_days: 0.82,
      contact_count: 0.79,
    });

    const weightingRuleEntries = Object.entries(result.weighting_rule);
    weightingRuleEntries.forEach(([, weight]) => {
      expect(typeof weight).toBe('number');
      expect(weight).toBeGreaterThanOrEqual(0.0);
      expect(weight).toBeLessThanOrEqual(1.0);
    });

    expect(result.weighting_rule).toHaveProperty('customer_industry');
    expect(result.weighting_rule).toHaveProperty('deal_amount');
    expect(result.weighting_rule).toHaveProperty('proposal_period_days');
    expect(result.weighting_rule).toHaveProperty('contact_count');

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        weighting_rule: result.weighting_rule,
      })
    );

    expect(result.created_at).toBe('2024-01-15T11:00:00Z');
  });
});