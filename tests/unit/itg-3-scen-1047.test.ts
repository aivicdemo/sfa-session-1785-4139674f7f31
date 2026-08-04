import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去成功パターン抽出・新規案件への適用推奨機能', () => {
  // SCEN-1047
  test('過去成功パターンを抽出し、新規案件に対して適用可能な提案アプローチを推奨する', () => {
    const mockPatternId = 'SUC-001';
    const mockRelevanceScore = 0.92;
    const mockApplicabilityScore = 0.89;
    const mockProposalApproach = 'ROI試算表を商談初期に提示し、3ヶ月での効果を数値化する';
    const mockSuccessReason = '同業種・同規模での85%成約率実績に基づく';

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: mockPatternId,
          industry: 'SaaS',
          companySize: '中堅企業',
          employees: 300,
          challenge: '業務効率化',
          proposalApproach: 'ROI重視',
          contractRate: 0.85,
          contractPeriodDays: 45,
          relevanceScore: mockRelevanceScore,
        },
      ]),
      generateRecommendation: jest.fn().mockReturnValue({
        patternId: mockPatternId,
        proposalApproach: mockProposalApproach,
        reasoning: mockSuccessReason,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: mockPatternId,
        applicabilityScore: mockApplicabilityScore,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(mockSuccessReason),
    };

    const newCaseInput = {
      industry: 'SaaS',
      companySize: '中堅企業',
      employees: 150,
      challenge: '営業プロセス効率化',
      budget: 5000000,
    };

    const result = generateRecommendation(newCaseInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.patternId).toBe(mockPatternId);
    expect(result.applicabilityScore).toBe(mockApplicabilityScore);
    expect(result.proposalApproach).toBe(mockProposalApproach);
    expect(result.reasoningBasis).toBe(mockSuccessReason);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseInput);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(mockPatternId, newCaseInput);
  });
});