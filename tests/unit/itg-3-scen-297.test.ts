import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 類似パターン検索・ランク付け機能', () => {
  test('SCEN-297: 過去商談データが1件のとき、そのデータの類似度スコアが算出される', async () => {
    const pastDealData = [
      {
        dealId: 'DEAL-001',
        customerName: 'A社',
        customerSize: '中堅企業',
        industry: '製造業',
        product: 'クラウドサービス',
        dealCondition: '中堅企業向けDX提案',
        successFlag: true,
      },
    ];

    const searchCondition = {
      customerSize: '中堅企業',
      industry: '製造業',
      issue: '業務効率化',
    };

    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similarPatterns: [
          {
            dealId: 'DEAL-001',
            similarityScore: 0.75,
            dealSummary: 'A社向けクラウドサービス提案 - 中堅企業DX支援',
          },
        ],
        totalPatternsFound: 1,
      }),
    };

    const result = await findSimilarPatterns(
      searchCondition,
      pastDealData,
      aiEngineStub
    );

    expect(result.totalPatternsFound).toBe(1);
    expect(result.similarPatterns).toHaveLength(1);
    expect(result.similarPatterns[0].dealId).toBe('DEAL-001');
    expect(result.similarPatterns[0].similarityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.similarPatterns[0].similarityScore).toBeLessThanOrEqual(1.0);
    expect(result.similarPatterns[0].similarityScore).toBe(0.75);
    expect(result.similarPatterns[0].dealSummary).toBe(
      'A社向けクラウドサービス提案 - 中堅企業DX支援'
    );

    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      searchCondition,
      pastDealData
    );
  });
});