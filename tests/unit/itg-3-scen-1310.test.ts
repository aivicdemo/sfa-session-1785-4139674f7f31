import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1310
  test('提案内容と顧客制約条件の自動照合機能 - 提案内容が顧客の経営目標と不一致のとき、目標適合度が低い値で数値化される', () => {
    // テストデータ: 顧客の経営目標
    const customerBusinessGoals = {
      revenueGrowthTarget: 0.30,
      costReductionTarget: 0.15,
    };

    // テストデータ: 提案内容
    const proposalContent = {
      description: '既存システムの小規模改善',
      maintenanceCost: 'maintain',
    };

    // スタブ: AIRecommendationEngineのevaluatePatternRelevanceメソッド
    // 提案内容と経営目標の適合度スコアを0.32（0〜1の範囲で評価）で返す
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.32,
        businessGoalAlignment: 0.32,
      }),
    };

    // 照合機能を実行
    const result = evaluatePatternRelevance(
      proposalContent,
      customerBusinessGoals,
      mockAIRecommendationEngine
    );

    // 照合処理完了後、システムが返却した目標適合度を確認
    expect(result.businessGoalAlignment).toBe(0.32);
    expect(result.displayPercentage).toBe('32%');
    expect(result.relevanceScore).toBe(0.32);
  });
});