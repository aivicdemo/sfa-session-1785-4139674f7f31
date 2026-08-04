import { visualizeRecommendationReasons } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1925: 購買履歴件数が業務上の最大規模（10,000件）のときに全件の根拠が返却される', async () => {
    fetchMock.resetMocks();

    const maxPurchaseHistoryCount = 10000;

    // テストデータ: 購買履歴件数が業務上の最大規模（10,000件）の顧客データ
    const testCustomerData = {
      customerId: 'CUST-20240115-001',
      customerName: 'テスト顧客企業',
      industry: '製造業',
      purchaseHistoryCount: maxPurchaseHistoryCount,
      purchaseHistories: Array.from({ length: maxPurchaseHistoryCount }, (_, i) => ({
        transactionId: `TXN-${String(i + 1).padStart(5, '0')}`,
        purchaseDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-15`,
        amount: 50000 + i * 100,
      })),
    };

    // AIRecommendationEngineのスタブ: 10,000件全件に対応した推奨根拠リストを返却
    const mockRecommendationReasons = Array.from(
      { length: maxPurchaseHistoryCount },
      (_, i) => ({
        patternId: `PATTERN-${String(i + 1).padStart(5, '0')}`,
        relevanceScore: 100 - (i % 100),
        reasoningText: `過去事例パターン${i + 1}から抽出された成功要因に基づいて推奨`,
        sourceTransactionId: `TXN-${String(i + 1).padStart(5, '0')}`,
      })
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);

    // AIRecommendationEngineのスタブレスポンス
    const aiEngineResponse = {
      success: true,
      customerId: testCustomerData.customerId,
      recommendationReasons: mockRecommendationReasons,
      totalReasonCount: maxPurchaseHistoryCount,
      generatedAt: '2024-01-15T11:00:00Z',
    };

    fetchMock.mockResponseOnce(JSON.stringify(aiEngineResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // 推奨根拠の可視化機能のAPIエンドポイント（/api/visualization/reasoning）にPOSTリクエスト送信
    const response = await visualizeRecommendationReasons(testCustomerData);

    // HTTPステータス200が返却されること
    expect(response.status).toBe(200);

    // レスポンスボディの推奨根拠配列（recommendationReasons）の長さが10,000であることを検証
    expect(response.data.recommendationReasons).toHaveLength(10000);

    // 推奨根拠配列の各要素に『patternId』『relevanceScore』『reasoningText』『sourceTransactionId』が全て含まれていることを確認
    response.data.recommendationReasons.forEach((reason) => {
      expect(reason).toHaveProperty('patternId');
      expect(reason).toHaveProperty('relevanceScore');
      expect(reason).toHaveProperty('reasoningText');
      expect(reason).toHaveProperty('sourceTransactionId');
    });

    // 推奨根拠配列内に、nullまたは未定義の要素が存在しないことを検証
    response.data.recommendationReasons.forEach((reason) => {
      expect(reason.patternId).not.toBeNull();
      expect(reason.patternId).toBeDefined();
      expect(reason.relevanceScore).not.toBeNull();
      expect(reason.relevanceScore).toBeDefined();
      expect(reason.reasoningText).not.toBeNull();
      expect(reason.reasoningText).toBeDefined();
      expect(reason.sourceTransactionId).not.toBeNull();
      expect(reason.sourceTransactionId).toBeDefined();
    });

    // 推奨根拠配列のソート順序が『relevanceScore』の降順（高い順）であることを確認
    for (let i = 0; i < response.data.recommendationReasons.length - 1; i++) {
      expect(response.data.recommendationReasons[i].relevanceScore).toBeGreaterThanOrEqual(
        response.data.recommendationReasons[i + 1].relevanceScore
      );
    }

    // 全件の根拠が完全に返却されていることを確認
    expect(response.data.recommendationReasons.length).toBe(maxPurchaseHistoryCount);
    expect(response.data.recommendationReasons.every((r) => r !== null && r !== undefined)).toBe(
      true
    );
  });
});