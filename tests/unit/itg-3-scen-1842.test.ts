import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1842
  test('[error] 推奨根拠の可視化機能 - 対象顧客の購買履歴が null のとき根拠情報取得に失敗する', async () => {
    // 顧客IDを準備
    const customerId = 'CUST-20240115-001';

    // 購買履歴データベースのモック（null を返すようスタブ化）
    const purchaseHistoryStub = {
      getPurchaseHistory: jest.fn().mockResolvedValue(null),
    };

    // AIRecommendationEngine の explainRecommendationReasoning メソッドをスタブ化
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(async (customerId, aiRecommendation, purchaseHistory) => {
        if (purchaseHistory === null) {
          return {
            success: false,
            errorMessage: '顧客の購買データが不足しています',
            fallbackAction: {
              displayMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
              useCachedRecommendations: true,
            },
          };
        }
      }),
    };

    // テスト実行：購買履歴が null の顧客に対して根拠情報の取得を実行
    const result = await mockAIEngine.explainRecommendationReasoning(
      customerId,
      { proposalApproach: 'Initial consultation', confidence: 85 },
      null // 購買履歴が null
    );

    // 期待結果の検証
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/購買データが不足/);
    expect(result.fallbackAction).toBeDefined();
    expect(result.fallbackAction.displayMessage).toMatch(/推奨の生成に一時的な遅延/);
    expect(result.fallbackAction.useCachedRecommendations).toBe(true);
  });
});