import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-194
  test('新規案件の顧客・商談条件に完全に一致する過去成功パターンが1件存在するとき、該当パターンに基づいた提案アプローチが推奨される', () => {
    const pastPattern = {
      patternId: 'PATTERN-001',
      customerScale: '大企業',
      industry: '製造業',
      challenge: '業務効率化',
      proposedApproach: '業務プロセス改善コンサル',
      successIndicator: '契約成立',
    };

    const similarPatterns = [
      {
        patternId: 'PATTERN-001',
        matchScore: 1.0,
        matchingCriteria: {
          customerScale: '大企業',
          industry: '製造業',
          challenge: '業務効率化',
        },
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(similarPatterns),
      generateRecommendation: jest.fn().mockReturnValue({
        applicablePatternId: 'PATTERN-001',
        recommendedApproach: '業務プロセス改善コンサル',
        matchScore: 1.0,
        matchingCriteria: {
          customerScale: '大企業',
          industry: '製造業',
          challenge: '業務効率化',
        },
      }),
      findSimilarPatternsSync: jest.fn().mockReturnValue(similarPatterns),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newOpportunity = {
      customerScale: '大企業',
      industry: '製造業',
      challenge: '業務効率化',
    };

    const result = generateRecommendation(newOpportunity, mockAIEngine);

    expect(result.applicablePatternId).toBe('PATTERN-001');
    expect(result.recommendedApproach).toBe('業務プロセス改善コンサル');
    expect(result.matchScore).toBe(1.0);
    expect(result.matchingCriteria).toEqual({
      customerScale: '大企業',
      industry: '製造業',
      challenge: '業務効率化',
    });
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newOpportunity);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newOpportunity,
      similarPatterns
    );
  });
});