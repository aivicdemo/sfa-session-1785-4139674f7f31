import { describe, test, expect, beforeEach } from '@jest/globals';
import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Extraction and Weighting Logic', () => {
  // SCEN-2825
  test('should preserve multiple success patterns with identical correlation scores without duplication', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([
        {
          id: 'pattern_001',
          correlationScore: 0.85,
          name: '大規模案件向け提案フロー',
        },
        {
          id: 'pattern_002',
          correlationScore: 0.85,
          name: 'リピート顧客向けアプローチ',
        },
        {
          id: 'pattern_003',
          correlationScore: 0.82,
          name: 'その他パターン',
        },
      ]),
    };

    const customerCondition = {
      customerId: 'cust_123',
      industry: 'manufacturing',
      companySize: 'large',
    };

    const dealCondition = {
      dealId: 'deal_456',
      dealType: 'new_project',
      estimatedValue: 5000000,
    };

    const result = await extractSuccessPatternsWithWeighting(
      customerCondition,
      dealCondition,
      mockAIEngine
    );

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      id: 'pattern_001',
      correlationScore: 0.85,
      name: '大規模案件向け提案フロー',
    });

    expect(result[1]).toEqual({
      id: 'pattern_002',
      correlationScore: 0.85,
      name: 'リピート顧客向けアプローチ',
    });

    expect(result[2]).toEqual({
      id: 'pattern_003',
      correlationScore: 0.82,
      name: 'その他パターン',
    });

    expect(result.filter((p) => p.id === 'pattern_001')).toHaveLength(1);
    expect(result.filter((p) => p.id === 'pattern_002')).toHaveLength(1);
    expect(result.filter((p) => p.id === 'pattern_003')).toHaveLength(1);

    expect(result[0].correlationScore).toBe(result[1].correlationScore);
    expect(result[1].correlationScore).toBeGreaterThan(result[2].correlationScore);
  });
});