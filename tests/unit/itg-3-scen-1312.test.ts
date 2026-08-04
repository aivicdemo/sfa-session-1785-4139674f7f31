import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案内容と顧客制約条件の自動照合機能', () => {
  // SCEN-1312
  test('複数の顧客制約条件がすべて満たされるとき、全体適合性スコアが統合される', () => {
    // ===== Setup: 顧客制約条件オブジェクト =====
    const constraint_a = {
      constraint_id: 'CONST_A_001',
      constraint_type: 'budget_limit',
      constraint_value: 5000000, // 予算上限：500万円
      description: '予算上限',
    };

    const constraint_b = {
      constraint_id: 'CONST_B_001',
      constraint_type: 'implementation_period',
      constraint_value: 3, // 導入期間：3ヶ月以内
      description: '導入期間制約',
    };

    const constraint_c = {
      constraint_id: 'CONST_C_001',
      constraint_type: 'supported_os',
      constraint_value: ['Windows', 'Linux'],
      description: '対応OS',
    };

    const customer_constraints = [constraint_a, constraint_b, constraint_c];

    // ===== Setup: 提案内容オブジェクト =====
    const proposal = {
      proposal_id: 'PROP_2024_001',
      proposal_price: 4500000, // 提案価格：450万円
      implementation_period_months: 2.5, // 導入期間：2.5ヶ月
      supported_os: ['Windows', 'Linux'], // 対応OS
      proposal_content: 'Sample proposal',
    };

    // ===== Setup: AIRecommendationEngine スタブ =====
    const ai_engine_stub = {
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation(
          (proposal_item: object, constraint_item: object) => {
            // constraint_a の評価: 予算チェック
            if (
              (constraint_item as Record<string, unknown>).constraint_id ===
              'CONST_A_001'
            ) {
              return { score: 0.95, reason: '予算内で適合' };
            }
            // constraint_b の評価: 実装期間チェック
            if (
              (constraint_item as Record<string, unknown>).constraint_id ===
              'CONST_B_001'
            ) {
              return { score: 0.98, reason: '導入期間内で適合' };
            }
            // constraint_c の評価: OS対応チェック
            if (
              (constraint_item as Record<string, unknown>).constraint_id ===
              'CONST_C_001'
            ) {
              return { score: 1.0, reason: 'OSすべて対応' };
            }
            return { score: 0, reason: 'Unknown constraint' };
          }
        ),
    };

    // ===== Execute =====
    const result = evaluateProposalAgainstConstraints(
      proposal,
      customer_constraints,
      ai_engine_stub
    );

    // ===== Assertions =====
    // 1. AIエンジンが3つの制約条件すべてに対して評価を実行したことを確認
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // 2. 全体適合性スコアの検証
    // 期待値: (0.95 + 0.98 + 1.0) / 3 ≈ 0.977666... → 小数点以下3桁で 0.977
    const expected_overall_score = 0.977;
    expect(result.overall_conformity_score).toBeCloseTo(expected_overall_score, 2);

    // 3. 全体適合性スコアが0.97以上であることを確認
    expect(result.overall_conformity_score).toBeGreaterThanOrEqual(0.97);

    // 4. 照合結果に各制約条件の判定結果が含まれていることを確認
    expect(result.constraint_evaluation_results).toHaveLength(3);

    // 5. 個別制約条件の判定結果がすべて『満たす』であることを確認
    expect(result.constraint_evaluation_results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          constraint_id: 'CONST_A_001',
          individual_score: 0.95,
          conformance_status: '満たす',
        }),
        expect.objectContaining({
          constraint_id: 'CONST_B_001',
          individual_score: 0.98,
          conformance_status: '満たす',
        }),
        expect.objectContaining({
          constraint_id: 'CONST_C_001',
          individual_score: 1.0,
          conformance_status: '満たす',
        }),
      ])
    );

    // 6. 照合結果オブジェクトが expected 構造を持つことを確認
    expect(result).toHaveProperty('overall_conformity_score');
    expect(result).toHaveProperty('constraint_evaluation_results');
    expect(result).toHaveProperty('conformance_assessment');
    expect(result.conformance_assessment).toBe('適合');
  });
});