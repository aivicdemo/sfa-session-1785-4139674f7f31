import { evaluateRecommendationEligibility } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨生成前データ完全性判定機能', () => {
  test('SCEN-731: 成功パターンが0件のときAIエージェント呼び出しが不要と判定される', () => {
    // Arrange: 新規案件データの入力パラメータを定義
    const newDealData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companySize: 500,
      dealAmount: 5000000,
      dealStage: '提案準備',
      products: ['製品A', '製品B'],
      dealConditions: {
        budget: 5000000,
        timeline: '2024-06-30',
        decision_maker: '経営層',
      },
    };

    // Mock関数: 過去商談データベースから成功パターンを検索
    // 成功パターンが0件を返す
    const mockSuccessPatterns = jest.fn().mockReturnValue([]);

    // Act: 推奨生成前データ完全性判定機能を実行
    const result = evaluateRecommendationEligibility(newDealData, mockSuccessPatterns);

    // Assert: AIエージェント呼び出し必要性フラグが false であることを確認
    expect(result.shouldCallAIRecommendationEngine).toBe(false);

    // Assert: スキップ理由が正確に含まれていることを確認
    expect(result.skipReason).toMatch(/過去商談データから成功パターンが0件/);

    // Assert: AIRecommendationEngineへの呼び出しが発生していないことをモック検証で確認
    expect(mockSuccessPatterns).toHaveBeenCalledTimes(1);
    expect(mockSuccessPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        industry: '製造業',
        companySize: 500,
      })
    );
  });
});