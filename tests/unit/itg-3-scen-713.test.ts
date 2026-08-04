import { evaluateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-713: 顧客データ完全性・妥当性判定機能 - 判定が「推奨生成可能」のとき、推奨生成可能フラグがtrueで通知される', () => {
    // Setup: テスト用の顧客データを準備
    const customerData = {
      customerId: 'CUST-001',
      customerName: 'サンプル株式会社',
      industry: '製造業',
      scale: 'large',
      budget: 5000000,
      challengeDescription: '製造工程の自動化による生産性向上'
    };

    // AIRecommendationEngine.evaluatePatternRelevanceのスタブを設定
    // スコア値0.8以上を返すように設定（推奨生成可能と判定される閾値）
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.85,
        isApplicable: true
      })
    };

    // 顧客データ完全性・妥当性判定機能を実行
    const result = evaluateCustomerDataCompleteness(customerData, mockAIEngine);

    // 期待結果の検証
    expect(result.canGenerateRecommendation).toBe(true);
    expect(result.judgmentStatus).toBe('READY_FOR_GENERATION');
    expect(result.isRecommendationGenerationEnabled).toBe(true);
    expect(result.relevanceScore).toBe(0.85);
  });
});