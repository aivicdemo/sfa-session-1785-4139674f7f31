import { evaluatePatternMatch } from '../../src/logic/it-1-br-3-3-2-1';

describe('Pattern Matching and Compliance Verification', () => {
  test('SCEN-1071: [normal] パターンマッチングと照合の実行 - 新規案件が過去の成功パターンと完全一致した場合、適用可能と判定される', () => {
    const pastSuccessPattern = {
      patternId: 'PATTERN_MSF_001',
      industry: '製造業',
      budgetMin: 5000000,
      decisionMakerCount: 3,
      leadTimeDays: 60,
    };

    const newDealData = {
      industry: '製造業',
      budgetAmount: 5000000,
      decisionMakerCount: 3,
      leadTimeDays: 60,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 1.0,
        isApplicable: true,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN_MSF_001',
          industry: '製造業',
          budgetMin: 5000000,
          decisionMakerCount: 3,
          leadTimeDays: 60,
          matchScore: 1.0,
        },
      ]),
    };

    const result = evaluatePatternMatch(newDealData, [pastSuccessPattern], mockAIEngine);

    expect(result.applicabilityJudgment).toBe('適用可能');
    expect(result.matchingScore).toBe(1.0);
    expect(result.matchedPatternId).toBe('PATTERN_MSF_001');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData, [pastSuccessPattern]);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});