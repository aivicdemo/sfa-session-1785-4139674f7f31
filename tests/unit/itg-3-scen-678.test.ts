import { extractSuccessPatternsAndRecommend } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを自動推奨', () => {
  // SCEN-678
  test('関連度スコアが閾値未満のパターンは推奨候補から除外される', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern-001',
          patternName: '大規模SIer向け提案アプローチ',
          relevanceScore: 0.35,
          successRate: 0.78,
          applicableCustomerSize: '大規模企業',
          applicableIndustry: '情報通信',
          recommendedProposalApproach: '段階的導入提案',
        },
        {
          patternId: 'pattern-002',
          patternName: '中堅製造業向け標準提案',
          relevanceScore: 0.72,
          successRate: 0.85,
          applicableCustomerSize: '中堅企業',
          applicableIndustry: '製造業',
          recommendedProposalApproach: '一括導入提案',
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockImplementation((patternId: string) => {
        if (patternId === 'pattern-001') {
          return 0.35;
        }
        if (patternId === 'pattern-002') {
          return 0.72;
        }
        return 0;
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealData = {
      customerSize: '中堅企業',
      industry: '製造業',
      budget: 5000000,
      dealStage: '初期提案',
      customerChallenges: ['業務効率化', 'システム統合'],
    };

    const relevanceThreshold = 0.50;

    const result = extractSuccessPatternsAndRecommend(
      newDealData,
      aiRecommendationEngineStub,
      relevanceThreshold
    );

    expect(result.recommendedPatterns).toHaveLength(1);
    expect(result.recommendedPatterns[0].patternId).toBe('pattern-002');
    expect(result.recommendedPatterns[0].patternName).toBe('中堅製造業向け標準提案');
    expect(result.recommendedPatterns[0].relevanceScore).toBe(0.72);

    expect(result.excludedPatterns).toHaveLength(1);
    expect(result.excludedPatterns[0].patternId).toBe('pattern-001');
    expect(result.excludedPatterns[0].patternName).toBe('大規模SIer向け提案アプローチ');
    expect(result.excludedPatterns[0].relevanceScore).toBe(0.35);
    expect(result.excludedPatterns[0].exclusionReason).toBe(
      '関連度スコアが閾値(0.50)未満'
    );

    expect(result.totalExcludedCount).toBe(1);
    expect(result.excludedReasonLog).toContain(
      'パターンID: pattern-001、関連度スコア: 0.35、除外理由: 関連度スコアが閾値(0.50)未満'
    );
  });
});