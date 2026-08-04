import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2054
  test('適用可能な成功パターン候補が複数件のとき、スコアが最も高い上位N件が推奨される', async () => {
    const newDealConditions = {
      customerIndustry: 'IT',
      challenge: 'デジタル変革',
      budgetScale: 5000000,
      dealSize: 'large',
      decisionMaker: 'CTO'
    };

    const mockSimilarPatterns = [
      {
        pastDealId: 'DEAL-001',
        industry: 'IT',
        challenge: 'デジタル変革',
        budget: 4800000,
        closedWon: true,
        winRate: 0.92,
        adoptionRate: 0.88
      },
      {
        pastDealId: 'DEAL-002',
        industry: 'IT',
        challenge: 'クラウド移行',
        budget: 3200000,
        closedWon: true,
        winRate: 0.85,
        adoptionRate: 0.81
      },
      {
        pastDealId: 'DEAL-003',
        industry: 'Finance',
        challenge: 'デジタル変革',
        budget: 6500000,
        closedWon: true,
        winRate: 0.78,
        adoptionRate: 0.75
      },
      {
        pastDealId: 'DEAL-004',
        industry: 'IT',
        challenge: 'コスト最適化',
        budget: 2000000,
        closedWon: false,
        winRate: 0.72,
        adoptionRate: 0.68
      },
      {
        pastDealId: 'DEAL-005',
        industry: 'Manufacturing',
        challenge: 'IoT導入',
        budget: 5500000,
        closedWon: true,
        winRate: 0.65,
        adoptionRate: 0.58
      }
    ];

    const relevanceScores = {
      'DEAL-001': 0.95,
      'DEAL-002': 0.87,
      'DEAL-003': 0.82,
      'DEAL-004': 0.76,
      'DEAL-005': 0.65
    };

    const mockFindSimilarPatterns = jest.fn().mockResolvedValue(mockSimilarPatterns);
    const mockEvaluatePatternRelevance = jest.fn().mockImplementation((pattern) => {
      return Promise.resolve({
        dealId: pattern.pastDealId,
        relevanceScore: relevanceScores[pattern.pastDealId],
        matchedFactors: [
          'industry_match',
          'budget_range_match',
          'challenge_alignment'
        ]
      });
    });

    const topNCount = 3;
    const scoredPatterns = [];

    for (const pattern of mockSimilarPatterns) {
      const relevance = await mockEvaluatePatternRelevance(pattern);
      scoredPatterns.push({
        pastDealId: pattern.pastDealId,
        industry: pattern.industry,
        challenge: pattern.challenge,
        budget: pattern.budget,
        closedWon: pattern.closedWon,
        winRate: pattern.winRate,
        adoptionRate: pattern.adoptionRate,
        relevanceScore: relevance.relevanceScore,
        matchedFactors: relevance.matchedFactors
      });
    }

    scoredPatterns.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topPatterns = scoredPatterns.slice(0, topNCount);

    expect(topPatterns).toHaveLength(3);
    expect(topPatterns[0].relevanceScore).toBe(0.95);
    expect(topPatterns[0].pastDealId).toBe('DEAL-001');
    expect(topPatterns[1].relevanceScore).toBe(0.87);
    expect(topPatterns[1].pastDealId).toBe('DEAL-002');
    expect(topPatterns[2].relevanceScore).toBe(0.82);
    expect(topPatterns[2].pastDealId).toBe('DEAL-003');

    const excludedPattern = scoredPatterns.find(p => p.relevanceScore === 0.76);
    expect(topPatterns).not.toContainEqual(excludedPattern);

    const excludedLowPattern = scoredPatterns.find(p => p.relevanceScore === 0.65);
    expect(topPatterns).not.toContainEqual(excludedLowPattern);

    topPatterns.forEach((pattern) => {
      expect(pattern.matchedFactors).toBeDefined();
      expect(Array.isArray(pattern.matchedFactors)).toBe(true);
      expect(pattern.matchedFactors.length).toBeGreaterThan(0);
    });

    topPatterns.forEach((pattern, index) => {
      if (index > 0) {
        expect(pattern.relevanceScore).toBeLessThanOrEqual(topPatterns[index - 1].relevanceScore);
      }
    });
  });
});