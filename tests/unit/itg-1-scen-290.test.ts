import { analyzeSuccessPatrixAndRecommendApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-290: [normal] 成功パターンマトリクス参照による提案アプローチ判定機能 - 現在の顧客の購買シグナルが強い場合、アプローチの実行優先度が上げられる
  test('購買シグナルが強い場合、提案アプローチの実行優先度が高（1位）に設定される', () => {
    const testData = {
      customer_id: 'CUST001',
      purchase_signal_strength: 'strong',
      business_challenge: '業務効率化',
      product_category: 'システム導入',
      customer_attribute: 'large_enterprise',
      sales_stage: 'proposal',
    };

    const result = analyzeSuccessPatrixAndRecommendApproach(testData);

    expect(result.approach_priority_rank).toBe(1);
    expect(result.approach_priority_label).toBe('high');
    expect(result.is_action_executable).toBe(true);
  });
});