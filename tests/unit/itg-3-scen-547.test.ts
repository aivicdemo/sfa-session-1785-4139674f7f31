import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { decideSalesGuidancePolicy } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-547
  test('改善優先度が中位ランク5のときスコア基準と同等で方針が決定される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 65,
        improvementPriorityRank: 5,
        priorityLabel: '中位ランク5'
      })
    };

    const improvementPriorityRank = 5;
    const customerCondition = '既存顧客・追加受注案件';
    const dealCondition = '契約金額500万円以上';

    const result = decideSalesGuidancePolicy(
      {
        improvementPriorityRank,
        customerCondition,
        dealCondition
      },
      mockAIRecommendationEngine
    );

    expect(result.guidancePolicy).toBe('既存顧客への深掘り提案');
    expect(result.decisionReason).toBe('改善優先度ランク5（スコア65点）がスコア基準と同等の閾値に該当');
    expect(result.scoreValue).toBe(65);
  });
});