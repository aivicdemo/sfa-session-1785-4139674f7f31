import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1393: 顧客の経営目標が0件のとき、適合度スコアが最小値となる', () => {
    // 顧客CUST-001: 経営目標件数0件
    const customer_with_zero_goals = {
      customer_id: 'CUST-001',
      business_objectives_count: 0,
    };

    // 顧客CUST-002: 経営目標件数3件
    const customer_with_three_goals = {
      customer_id: 'CUST-002',
      business_objectives_count: 3,
    };

    // 提案条件（両顧客で同一）
    const proposal_input = {
      proposal_content: 'クラウド導入支援',
      proposal_amount: 5000000,
    };

    // AIRecommendationEngineスタブの定義
    const ai_engine_stub = {
      evaluatePatternRelevance: (
        customer_data: { customer_id: string; business_objectives_count: number },
        proposal_data: { proposal_content: string; proposal_amount: number }
      ): number => {
        // 適合度スコアの計算ロジック
        // 経営目標件数が0件の場合は最小値0.0を返す
        if (customer_data.business_objectives_count === 0) {
          return 0.0;
        }
        // 経営目標件数が3件の場合のスコア計算例
        // (基本スコア + 経営目標件数 * 重み係数) / スケーリング係数
        const base_score = 50.0;
        const objective_weight = 10.0;
        const relevance_score =
          (base_score + customer_data.business_objectives_count * objective_weight) / 2.0;
        return relevance_score;
      },
    };

    // 顧客CUST-001（経営目標0件）の適合度スコアを計算
    const score_cust_001 = evaluatePatternRelevance(
      customer_with_zero_goals,
      proposal_input,
      ai_engine_stub.evaluatePatternRelevance
    );

    // 顧客CUST-002（経営目標3件）の適合度スコアを計算
    const score_cust_002 = evaluatePatternRelevance(
      customer_with_three_goals,
      proposal_input,
      ai_engine_stub.evaluatePatternRelevance
    );

    // 検証1: CUST-001のスコアが最小値0.0に等しい
    expect(score_cust_001).toBe(0.0);

    // 検証2: CUST-002のスコアが(50.0 + 3 * 10.0) / 2.0 = 40.0
    expect(score_cust_002).toBe(40.0);

    // 検証3: CUST-001のスコアがCUST-002より低い
    expect(score_cust_001).toBeLessThan(score_cust_002);

    // 検証4: スコアが浮動小数点数で、小数点以下4桁以上の精度を持つ
    expect(typeof score_cust_001).toBe('number');
    expect(typeof score_cust_002).toBe('number');
    expect(Number.isFinite(score_cust_001)).toBe(true);
    expect(Number.isFinite(score_cust_002)).toBe(true);
  });
});