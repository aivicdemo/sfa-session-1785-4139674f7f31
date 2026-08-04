import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

interface MatchedPattern {
  patternId: string;
  matchScore: number;
  patternDescription: string;
}

interface CustomerConditionMatch {
  condition: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

interface RecommendationReasoningOutput {
  matchedPatterns: MatchedPattern[];
  customerConditionMatches: CustomerConditionMatch[];
}

interface RecommendationInput {
  customerSize: string;
  industry: string;
  budget: string;
  implementationPeriod: string;
}

interface AIRecommendationEngine {
  generateRecommendation: (input: RecommendationInput) => Promise<{ recommendation: string; reasoningData: object }>;
  explainRecommendationReasoning: (input: RecommendationInput) => Promise<RecommendationReasoningOutput>;
}

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1055
  test('推奨根拠に顧客条件との照合結果が含まれる', async () => {
    const mockAIEngine: AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: 'クラウドERP導入プラン',
        reasoningData: {}
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        matchedPatterns: [
          {
            patternId: 'PAT-001',
            matchScore: 0.92,
            patternDescription: '大規模製造業のERP導入成功事例'
          },
          {
            patternId: 'PAT-003',
            matchScore: 0.87,
            patternDescription: '短期導入期間での実装事例'
          }
        ],
        customerConditionMatches: [
          {
            condition: '企業規模1000名以上',
            relevance: 'HIGH',
            reason: '過去成功事例の75%が同規模企業'
          },
          {
            condition: '業種製造業',
            relevance: 'HIGH',
            reason: 'ERP導入成功率が業種平均より12%高い'
          },
          {
            condition: '予算500万円以上',
            relevance: 'MEDIUM',
            reason: '提案プランに必要な最小予算を満たす'
          },
          {
            condition: '導入期間3ヶ月以内',
            relevance: 'MEDIUM',
            reason: '段階的導入により対応可能'
          }
        ]
      })
    };

    const testInput: RecommendationInput = {
      customerSize: '従業員1000名以上',
      industry: '製造業',
      budget: '500万円以上',
      implementationPeriod: '3ヶ月以内'
    };

    const result = await visualizeRecommendationReasoning(testInput, mockAIEngine);

    expect(result.matchedPatterns).toHaveLength(2);
    expect(result.matchedPatterns[0]).toEqual({
      patternId: 'PAT-001',
      matchScore: 0.92,
      patternDescription: '大規模製造業のERP導入成功事例'
    });
    expect(result.matchedPatterns[1]).toEqual({
      patternId: 'PAT-003',
      matchScore: 0.87,
      patternDescription: '短期導入期間での実装事例'
    });

    expect(result.customerConditionMatches).toHaveLength(4);
    expect(result.customerConditionMatches[0]).toEqual({
      condition: '企業規模1000名以上',
      relevance: 'HIGH',
      reason: '過去成功事例の75%が同規模企業'
    });
    expect(result.customerConditionMatches[1]).toEqual({
      condition: '業種製造業',
      relevance: 'HIGH',
      reason: 'ERP導入成功率が業種平均より12%高い'
    });
    expect(result.customerConditionMatches[2]).toEqual({
      condition: '予算500万円以上',
      relevance: 'MEDIUM',
      reason: '提案プランに必要な最小予算を満たす'
    });
    expect(result.customerConditionMatches[3]).toEqual({
      condition: '導入期間3ヶ月以内',
      relevance: 'MEDIUM',
      reason: '段階的導入により対応可能'
    });

    expect(result.matchedPatterns[0].matchScore).toBe(0.92);
    expect(result.matchedPatterns[1].matchScore).toBe(0.87);
    expect(result.customerConditionMatches.filter((m) => m.relevance === 'HIGH')).toHaveLength(2);
    expect(result.customerConditionMatches.filter((m) => m.relevance === 'MEDIUM')).toHaveLength(2);
  });
});