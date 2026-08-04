import { matchSuccessPattern } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  test('SCEN-2594: 入力された商談条件が完全に設定されている場合、正確に成功パターンと照合される', () => {
    const mockSuccessPatterns = [
      {
        patternId: 'SUC-001',
        industry: '製造業',
        budgetRange: { min: 4000000, max: 6000000 },
        decisionMakerLevel: 'CFO',
        issue: '生産効率化',
        similarityScore: 0.95,
      },
      {
        patternId: 'SUC-002',
        industry: '製造業',
        budgetRange: { min: 3000000, max: 7000000 },
        decisionMakerLevel: '経営層',
        issue: 'コスト削減',
        similarityScore: 0.87,
      },
    ];

    const mockRelevanceScores: { [key: string]: number } = {
      'SUC-001': 0.95,
      'SUC-002': 0.87,
    };

    const stubAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSuccessPatterns),
      evaluatePatternRelevance: jest.fn((patternId: string) =>
        Promise.resolve(mockRelevanceScores[patternId])
      ),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerName: 'A社',
      industry: '製造業',
      dealAmount: 5000000,
      decisionMaker: {
        name: '田中太郎',
        title: 'CFO',
      },
      issue: '生産効率化',
      budgetStatus: '確定済み',
      implementationTimeline: '3ヶ月以内',
      competitionStatus: 'なし',
    };

    return matchSuccessPattern(dealCondition, stubAIRecommendationEngine).then(
      (result) => {
        expect(result.matchedPatternId).toBe('SUC-001');
        expect(result.relevanceScore).toBe(0.95);
        expect(result.matchingFields).toEqual([
          '業種',
          '予算範囲',
          '決定者レベル',
          '課題',
        ]);
        expect(result.recommendedApproach).toBe(
          '決定権者CFOに対し生産効率化のビジネスケース提示'
        );
        expect(result.confidenceLevel).toBe('HIGH');

        expect(stubAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
          dealCondition
        );
        expect(stubAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
          'SUC-001'
        );
      }
    );
  });
});