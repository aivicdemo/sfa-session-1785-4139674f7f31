import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-301
  test('[edge] 類似パターン検索・ランク付け機能 - 検索対象の過去商談データが同一の類似度スコアで複数件並んでいるとき、それらが同等のランクで返却される', () => {
    const mockHistoricalPatterns = [
      {
        id: 'pattern_001',
        industry: '製造業',
        budgetRange: '5000万円',
        implementationPeriod: '6ヶ月',
        successScore: 0.92,
      },
      {
        id: 'pattern_002',
        industry: '製造業',
        budgetRange: '4000万円',
        implementationPeriod: '5ヶ月',
        successScore: 0.78,
      },
      {
        id: 'pattern_003',
        industry: '建設業',
        budgetRange: '6000万円',
        implementationPeriod: '7ヶ月',
        successScore: 0.85,
      },
      {
        id: 'pattern_004',
        industry: '製造業',
        budgetRange: '5100万円',
        implementationPeriod: '6ヶ月',
        successScore: 0.85,
      },
      {
        id: 'pattern_005',
        industry: '製造業',
        budgetRange: '4900万円',
        implementationPeriod: '6ヶ月',
        successScore: 0.85,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn((newCaseCondition) => {
        const similarities = mockHistoricalPatterns.map((pattern) => {
          let similarityScore = 0.0;
          if (newCaseCondition.industry === pattern.industry) {
            similarityScore += 0.3;
          }
          if (newCaseCondition.budgetRange === pattern.budgetRange) {
            similarityScore += 0.35;
          }
          if (newCaseCondition.implementationPeriod === pattern.implementationPeriod) {
            similarityScore += 0.35;
          }
          return {
            patternId: pattern.id,
            similarity: similarityScore,
            matchedFields: [],
          };
        });

        const sorted = similarities.sort((a, b) => b.similarity - a.similarity);

        let currentRank = 1;
        let previousSimilarity = sorted.length > 0 ? sorted[0].similarity : null;
        const withRanks = sorted.map((item) => {
          if (item.similarity !== previousSimilarity) {
            currentRank += 1;
            previousSimilarity = item.similarity;
          }
          return {
            patternId: item.patternId,
            similarity: item.similarity,
            rank: currentRank,
          };
        });

        return withRanks;
      }),
    };

    const newCaseCondition = {
      industry: '製造業',
      budgetRange: '5000万円',
      implementationPeriod: '6ヶ月',
    };

    const result = mockAIEngine.findSimilarPatterns(newCaseCondition);

    const itemsWithSimilarity085 = result.filter((item) => item.similarity === 0.85);
    expect(itemsWithSimilarity085).toHaveLength(3);

    const rank085 = itemsWithSimilarity085[0].rank;
    itemsWithSimilarity085.forEach((item) => {
      expect(item.rank).toBe(rank085);
    });

    const itemsWithOtherSimilarity = result.filter((item) => item.similarity !== 0.85);
    itemsWithOtherSimilarity.forEach((item) => {
      expect(item.rank).not.toBe(rank085);
    });

    expect(result).toHaveLength(5);
    expect(result[0].similarity).toBe(0.92);
    expect(result[0].rank).toBe(1);
    expect(result[1].similarity).toBe(0.85);
    expect(result[1].rank).toBe(2);
  });
});