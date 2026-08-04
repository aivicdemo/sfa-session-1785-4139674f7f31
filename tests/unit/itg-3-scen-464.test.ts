import { evaluatePatternRelevance } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  // SCEN-464
  test('スコアが最低水準（0～20点）の場合、「即座の対処」が推奨される', () => {
    // 準備: テスト用の顧客・商談データ
    const mockCustomerData = {
      industry: '製造業',
      dealStage: '初期接触',
      budgetScale: '小規模',
      challengeClarity: '低い',
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 15,
        relevanceDetails: [],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 指導施策推奨機能を実行
    const result = evaluatePatternRelevance(
      {
        customerId: 'CUST-001',
        dealId: 'DEAL-001',
        industry: mockCustomerData.industry,
        dealStage: mockCustomerData.dealStage,
        budgetScale: mockCustomerData.budgetScale,
        challengeClarity: mockCustomerData.challengeClarity,
      },
      mockAIEngine
    );

    // 戻り値の推奨施策オブジェクトを検証
    expect(result).toBeDefined();
    expect(result.recommendedAction).toContain('即座の対処');
    expect(result.priority).toBe('CRITICAL');
    expect(result.reasoning).toMatch(/スコア0～20点|即座の顧客対応|課題ヒアリング|関係構築|迅速なフォローアップ|失注リスク|顧客ニーズ把握/);
    expect(result.score).toBe(15);
  });
});