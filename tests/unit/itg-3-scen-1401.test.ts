import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('提案内容と顧客制約条件の自動照合機能', () => {
  // SCEN-1401
  test('顧客制約条件が複数件のとき、すべてが照合対象に含まれる', () => {
    fetchMock.resetMocks();

    // テスト用の顧客制約条件を3件用意
    const constraint_a = {
      constraint_id: 'CONST_A_001',
      customer_id: 'CUST_001',
      constraint_type: 'BUDGET_LIMIT',
      constraint_value: 5000000,
      constraint_unit: 'JPY',
      description: '予算上限500万円',
    };

    const constraint_b = {
      constraint_id: 'CONST_B_001',
      customer_id: 'CUST_001',
      constraint_type: 'IMPLEMENTATION_PERIOD',
      constraint_value: 3,
      constraint_unit: 'MONTHS',
      description: '導入期間3ヶ月以内',
    };

    const constraint_c = {
      constraint_id: 'CONST_C_001',
      customer_id: 'CUST_001',
      constraint_type: 'SYSTEM_INTEGRATION',
      constraint_value: true,
      constraint_unit: 'BOOLEAN',
      description: '既存システムとの連携必須',
    };

    const customer_constraints = [constraint_a, constraint_b, constraint_c];

    const proposal_content = {
      proposal_id: 'PROP_001',
      customer_id: 'CUST_001',
      product_name: 'Enterprise Solution',
      proposed_budget: 4500000,
      implementation_period_months: 2,
      system_integration_required: true,
      expected_effects: ['効率化', 'コスト削減'],
    };

    // AIRecommendationEngineのスタブを設定
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC_001',
        compatibility_score: 95,
        constraint_compatibility_details: [
          {
            constraint_id: 'CONST_A_001',
            is_compatible: true,
            explanation: '提案予算が制約内',
          },
          {
            constraint_id: 'CONST_B_001',
            is_compatible: true,
            explanation: '実装期間が制約内',
          },
          {
            constraint_id: 'CONST_C_001',
            is_compatible: true,
            explanation: 'システム連携対応可能',
          },
        ],
        reasoning: '全制約条件を満たす提案',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 提案内容自動照合機能のメインメソッドを実行
    const result = evaluateProposalAgainstConstraints(
      proposal_content,
      customer_constraints,
      mock_ai_engine
    );

    // AIRecommendationEngineのスタブが実際に呼び出されたかを確認
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalled();

    // スタブの呼び出し引数から、渡された制約条件の配列を取得
    const call_args = mock_ai_engine.generateRecommendation.mock.calls[0];
    const passed_constraints = call_args[1];

    // 取得した配列の長さが3であることを検証
    expect(passed_constraints).toHaveLength(3);

    // 配列に含まれる各制約条件が、入力した3件と完全一致することを検証
    expect(passed_constraints[0]).toEqual(constraint_a);
    expect(passed_constraints[1]).toEqual(constraint_b);
    expect(passed_constraints[2]).toEqual(constraint_c);

    // 返された結果が照合完了状態であることを検証
    expect(result.compatibility_score).toBe(95);
    expect(result.constraint_compatibility_details).toHaveLength(3);
    expect(result.constraint_compatibility_details[0].constraint_id).toBe('CONST_A_001');
    expect(result.constraint_compatibility_details[1].constraint_id).toBe('CONST_B_001');
    expect(result.constraint_compatibility_details[2].constraint_id).toBe('CONST_C_001');
  });
});