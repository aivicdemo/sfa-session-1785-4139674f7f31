import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-300
  test('類似パターン検索・ランク付け機能 - 検索対象の過去商談データが101件のとき、最新100件のみがランク付け対象になる', async () => {
    // 過去商談データ101件を準備
    const pastDeals = Array.from({ length: 101 }, (_, index) => ({
      id: `deal_${String(index + 1).padStart(3, '0')}`,
      customerId: `cust_${index + 1}`,
      customerIndustry: 'IT',
      customerScale: 'large',
      dealAmount: 1000000 + index * 10000,
      dealStage: 'proposal',
      businessChallenge: 'cost_reduction',
      proposalApproach: 'cloud_migration',
      embedding: Array(1536).fill(0.1 + index * 0.001),
      isSuccessful: index % 2 === 0,
      createdAt: new Date(new Date('2024-01-01').getTime() + index * 86400000).toISOString(),
    }));

    // AIRecommendationEngineのスタブ化
    const capturedDatasets: unknown[] = [];
    const stubAIEngine = {
      findSimilarPatterns: jest.fn(async (dataset: unknown[]) => {
        capturedDatasets.push(dataset);
        const typedDataset = dataset as Array<{
          id: string;
          embedding: number[];
          isSuccessful: boolean;
        }>;
        return typedDataset
          .sort(
            (a, b) =>
              Math.random() -
              0.5
          )
          .slice(0, 10)
          .map((deal) => ({
            dealId: deal.id,
            similarityScore: 85 + Math.random() * 15,
            successFlag: deal.isSuccessful,
          }));
      }),
    };

    // 新規案件データ
    const newDeal = {
      customerId: 'new_cust_001',
      customerIndustry: 'IT',
      customerScale: 'large',
      dealAmount: 1500000,
      businessChallenge: 'cost_reduction',
      embedding: Array(1536).fill(0.15),
    };

    // 類似パターン検索・ランク付け機能を実行
    const rankingResult = await findSimilarPatterns(
      newDeal as Parameters<typeof findSimilarPatterns>[0],
      pastDeals as Parameters<typeof findSimilarPatterns>[1],
      stubAIEngine as Parameters<typeof findSimilarPatterns>[2],
    );

    // AIエンジンのスタブが呼び出されたことを確認
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalled();

    // 渡されたデータセットのサイズが正確に100件であることを確認
    expect(capturedDatasets.length).toBe(1);
    const passedDataset = capturedDatasets[0] as Array<{ id: string }>;
    expect(passedDataset.length).toBe(100);

    // deal_001～deal_100のみが含まれていることを確認
    const passedDealIds = passedDataset.map((d) => d.id).sort();
    const expectedDealIds = Array.from({ length: 100 }, (_, i) =>
      `deal_${String(i + 1).padStart(3, '0')}`,
    ).sort();
    expect(passedDealIds).toEqual(expectedDealIds);

    // deal_101（最も古い1件）が除外されていることを確認
    expect(passedDealIds).not.toContain('deal_101');

    // ランク付け結果として返却される商談が最新100件のデータから生成されていることを確認
    expect(rankingResult).toBeDefined();
    expect(Array.isArray(rankingResult)).toBe(true);
    const resultArray = rankingResult as Array<{ dealId: string }>;
    resultArray.forEach((result) => {
      expect(result.dealId).toMatch(/^deal_\d{3}$/);
      const dealNumber = parseInt(result.dealId.replace('deal_', ''), 10);
      expect(dealNumber).toBeGreaterThanOrEqual(1);
      expect(dealNumber).toBeLessThanOrEqual(100);
    });
  });
});