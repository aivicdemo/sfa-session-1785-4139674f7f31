import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1241: [edge] 提案妥当性判定機能 - 顧客ニーズ適合度がちょうど閾値（70%）のときに承認判定される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(70),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const customerId = 'CUST-20240115-001';
    const dealConditions = {
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      timeline: 90,
    };
    const successPatternMatchResult = {
      relevanceScore: 70,
      matchedPatternId: 'PATTERN-2024-001',
      pastCaseCount: 12,
    };

    const result = evaluateProposalFeasibility(
      {
        customerId,
        dealConditions,
        successPatternMatchResult,
      },
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('approved');
    expect(result.judgementReason).toMatch(/顧客ニーズ適合度.*70%.*到達/);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId,
        relevanceScore: 70,
      })
    );
  });
});