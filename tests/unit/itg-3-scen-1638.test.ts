import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨妥当性スコア算出', () => {
  test('SCEN-1638: 同一入力データで2回連続実行した場合、同じスコアが算出される', () => {
    // 入力データセット：顧客属性、商談条件、予算規模などを含む
    const inputDataset = {
      customerId: 'CUST-2024-001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      customerChallenges: ['cost_reduction', 'efficiency_improvement'],
      productCategory: 'erp_system',
      budgetRange: 'high',
      implementationTimeline: 90,
      decisionMakerLevel: 'executive'
    };

    // 1回目の実行：スコア値を取得
    const scoreResult1 = evaluateRecommendationRelevance(inputDataset);

    // 2回目の実行：同一入力データセットでスコア値を取得
    const scoreResult2 = evaluateRecommendationRelevance(inputDataset);

    // scoreResult1とscoreResult2が完全に一致することを検証
    expect(scoreResult1).toBe(scoreResult2);

    // スコア値が0～100の範囲内であることを確認
    expect(scoreResult1).toBeGreaterThanOrEqual(0);
    expect(scoreResult1).toBeLessThanOrEqual(100);

    // 小数点以下の桁数を含めて同一のスコア値が算出されていることを確認
    expect(scoreResult1.toFixed(4)).toBe(scoreResult2.toFixed(4));
  });
});