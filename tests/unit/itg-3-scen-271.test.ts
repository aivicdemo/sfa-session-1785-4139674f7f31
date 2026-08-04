import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨する機能', () => {
  test('SCEN-271: 成功パターン抽出・マッチング機能 - 過去商談データが逆順で入力されるとき類似度スコアによる正しいランク付けが維持される', async () => {
    // テストデータ準備：異なる契約日付を持つ5件の過去商談データ
    const pastDealData = [
      {
        dealId: 'deal_001',
        contractDate: '2024-01-15T10:00:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'DX推進支援',
        successIndicator: 1,
      },
      {
        dealId: 'deal_002',
        contractDate: '2024-01-10T09:30:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'デジタル変革',
        successIndicator: 1,
      },
      {
        dealId: 'deal_003',
        contractDate: '2024-01-05T14:20:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'IT導入',
        successIndicator: 1,
      },
      {
        dealId: 'deal_004',
        contractDate: '2023-12-28T11:00:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'large_enterprise',
        proposalContent: 'システム統合',
        successIndicator: 1,
      },
      {
        dealId: 'deal_005',
        contractDate: '2023-12-20T08:45:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'small_enterprise',
        proposalContent: 'クラウド導入',
        successIndicator: 1,
      },
    ];

    // 過去商談データを新しい順（降順）にソートして、入力配列に設定
    const sortedPastDealData = pastDealData.sort(
      (a, b) => new Date(b.contractDate).getTime() - new Date(a.contractDate).getTime()
    );

    // AIRecommendationEngineのfindSimilarPatternsメソッドをモック化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    // 各商談データに対して類似度スコアを返すよう設定
    // 最古の商談（deal_005）=0.95、deal_004=0.87、deal_003=0.92、deal_002=0.78、deal_001=0.81
    const similarityScores = {
      deal_005: 0.95,
      deal_003: 0.92,
      deal_004: 0.87,
      deal_001: 0.81,
      deal_002: 0.78,
    };

    // モックの戻り値を設定：スコア降順でソートされた結果
    const expectedMatchingResult = [
      {
        dealId: 'deal_005',
        contractDate: '2023-12-20T08:45:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'small_enterprise',
        proposalContent: 'クラウド導入',
        similarityScore: 0.95,
      },
      {
        dealId: 'deal_003',
        contractDate: '2024-01-05T14:20:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'IT導入',
        similarityScore: 0.92,
      },
      {
        dealId: 'deal_004',
        contractDate: '2023-12-28T11:00:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'large_enterprise',
        proposalContent: 'システム統合',
        similarityScore: 0.87,
      },
      {
        dealId: 'deal_001',
        contractDate: '2024-01-15T10:00:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'DX推進支援',
        similarityScore: 0.81,
      },
      {
        dealId: 'deal_002',
        contractDate: '2024-01-10T09:30:00Z',
        customerIndustry: 'manufacturing',
        dealScale: 'mid_enterprise',
        proposalContent: 'デジタル変革',
        similarityScore: 0.78,
      },
    ];

    mockAIEngine.findSimilarPatterns.mockResolvedValue(expectedMatchingResult);

    // 新規案件の顧客・商談条件
    const newCaseDeal = {
      customerIndustry: 'manufacturing',
      dealScale: 'mid_enterprise',
      challengePattern: 'DX_PROMOTION',
    };

    // findSimilarPatternsメソッドを実行
    const matchingResult = await findSimilarPatterns(
      newCaseDeal,
      sortedPastDealData,
      mockAIEngine
    );

    // 戻り値のマッチング結果配列が、類似度スコアの降順でソートされていることを確認
    expect(matchingResult).toHaveLength(5);

    // 具体的な順序検証：スコア0.95→0.92→0.87→0.81→0.78
    expect(matchingResult[0].similarityScore).toBe(0.95);
    expect(matchingResult[0].dealId).toBe('deal_005');

    expect(matchingResult[1].similarityScore).toBe(0.92);
    expect(matchingResult[1].dealId).toBe('deal_003');

    expect(matchingResult[2].similarityScore).toBe(0.87);
    expect(matchingResult[2].dealId).toBe('deal_004');

    expect(matchingResult[3].similarityScore).toBe(0.81);
    expect(matchingResult[3].dealId).toBe('deal_001');

    expect(matchingResult[4].similarityScore).toBe(0.78);
    expect(matchingResult[4].dealId).toBe('deal_002');

    // スコアが厳密に降順であることを確認
    for (let i = 0; i < matchingResult.length - 1; i++) {
      expect(matchingResult[i].similarityScore).toBeGreaterThan(
        matchingResult[i + 1].similarityScore
      );
    }

    // 入力データの時系列順序（新しい順）と出力結果のランク付け順序（スコア降順）が異なることを確認
    const inputTimelineOrder = sortedPastDealData.map(d => d.dealId);
    const outputScoreOrder = matchingResult.map(m => m.dealId);

    expect(inputTimelineOrder).toEqual(['deal_001', 'deal_002', 'deal_003', 'deal_004', 'deal_005']);
    expect(outputScoreOrder).toEqual(['deal_005', 'deal_003', 'deal_004', 'deal_001', 'deal_002']);
    expect(inputTimelineOrder).not.toEqual(outputScoreOrder);
  });
});