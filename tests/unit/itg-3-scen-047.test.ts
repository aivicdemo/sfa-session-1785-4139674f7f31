import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-047: [normal] 類似パターン検索機能 - 類似パターンが1件の場合に検索結果が正常に返される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          similarity: 0.92,
          dealName: '過去成功案件A',
          industry: '製造業',
          dealSize: '500万円',
          approachStrategy: '導入効果の数値化提案',
          matchedConditions: ['業種一致', '予算帯一致'],
        },
      ]),
    };

    const currentDealConditions = {
      customerIndustry: '製造業',
      estimatedBudget: '450万円',
      dealStage: '提案準備',
    };

    const result = await findSimilarPatterns(
      currentDealConditions,
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(1);
    expect(result[0].patternId).toBe('PAT-001');
    expect(result[0].similarity).toBe(0.92);
    expect(result[0].dealName).toBe('過去成功案件A');
    expect(result[0].approachStrategy).toBe('導入効果の数値化提案');
    expect(result[0].matchedConditions).toHaveLength(2);
    expect(result[0].matchedConditions).toContain('業種一致');
    expect(result[0].matchedConditions).toContain('予算帯一致');
  });
});