import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2903
  test('新規案件と過去成功パターンの照合ランキング - ランキング結果に重複する成功パターンが含まれないことが保証される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          id: 'pattern-001',
          customerIndustry: 'IT',
          budgetRange: 5000000,
          decisionMakerCount: 3,
          successRate: 0.85,
          matchScore: 0.92,
        },
        {
          id: 'pattern-002',
          customerIndustry: 'IT',
          budgetRange: 4500000,
          decisionMakerCount: 3,
          successRate: 0.80,
          matchScore: 0.88,
        },
        {
          id: 'pattern-001',
          customerIndustry: 'IT',
          budgetRange: 5000000,
          decisionMakerCount: 3,
          successRate: 0.85,
          matchScore: 0.92,
        },
      ]),
    };

    const newDealCondition = {
      customerIndustry: 'IT',
      budgetRange: 5000000,
      decisionMakerCount: 3,
    };

    const rankingResult = await findSimilarPatterns(
      newDealCondition,
      mockAIEngine
    );

    expect(rankingResult.length).toBe(2);

    const patternIds = rankingResult.map((pattern) => pattern.id);
    const uniquePatternIds = new Set(patternIds);

    expect(uniquePatternIds.size).toBe(2);
    expect(patternIds).toEqual(['pattern-001', 'pattern-002']);
  });
});