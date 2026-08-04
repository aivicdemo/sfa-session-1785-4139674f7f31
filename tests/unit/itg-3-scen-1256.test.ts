import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性判定', () => {
  // SCEN-1256
  test('リスク要因が0件のときに判定ロジックが適切に処理される', () => {
    const mock_AIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '評価対象のリスク要因がないため詳細判定を省略'
      ),
    };

    const dealCondition = {
      deal_id: 'DEAL-001',
      customer_id: 'CUST-001',
      product_category: 'SaaS',
      proposed_amount: 500000,
      risk_factors: [],
    };

    const result = evaluateProposalValidity(
      dealCondition,
      mock_AIRecommendationEngine
    );

    expect(result.status).toBe('リスク判定対象なし');
    expect(result.validity_score).toBe(0);
    expect(result.explanation).toBe(
      '評価対象のリスク要因がないため詳細判定を省略'
    );
    expect(result.risk_factors_count).toBe(0);
    expect(mock_AIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});