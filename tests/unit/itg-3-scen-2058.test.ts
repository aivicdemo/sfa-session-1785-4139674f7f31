import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2058
  test('成功パターン候補リストに重複パターンが含まれるとき、重複排除された後にランク付けが行われる', () => {
    const successPatternCandidates = [
      {
        patternId: 'A',
        customerScale: '中堅',
        industry: '製造',
        proposalMethod: 'コンサル型',
      },
      {
        patternId: 'B',
        customerScale: '中堅',
        industry: '製造',
        proposalMethod: 'コンサル型',
      },
      {
        patternId: 'C',
        customerScale: '大企業',
        industry: '金融',
        proposalMethod: '導入支援型',
      },
      {
        patternId: 'A_dup',
        customerScale: '中堅',
        industry: '製造',
        proposalMethod: 'コンサル型',
      },
    ];

    const newCaseCondition = {
      customerScale: '中堅',
      industry: '製造',
      issue: '業務効率化',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(
        (candidates, condition) => {
          const deduplicatedAndRanked = [
            {
              patternId: 'A',
              customerScale: '中堅',
              industry: '製造',
              proposalMethod: 'コンサル型',
              relevanceScore: 0.92,
            },
            {
              patternId: 'C',
              customerScale: '大企業',
              industry: '金融',
              proposalMethod: '導入支援型',
              relevanceScore: 0.58,
            },
          ];
          return deduplicatedAndRanked;
        }
      ),
    };

    const result = findSimilarPatterns(
      successPatternCandidates,
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      patternId: 'A',
      customerScale: '中堅',
      industry: '製造',
      proposalMethod: 'コンサル型',
      relevanceScore: 0.92,
    });
    expect(result[1]).toMatchObject({
      patternId: 'C',
      customerScale: '大企業',
      industry: '金融',
      proposalMethod: '導入支援型',
      relevanceScore: 0.58,
    });
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      successPatternCandidates,
      newCaseCondition
    );
  });
});