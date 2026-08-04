import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-266
  test('類似度スコアが適用閾値と一致するとき、該当パターンが採用される', () => {
    const current_deal_condition = {
      customer_scale: '中堅企業',
      industry: '製造業',
      challenge: 'デジタル化',
      budget: '500万円以上',
      decision_period: '3ヶ月以内'
    };

    const pattern_id = 'PAT-001';

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn(() => [
        {
          pattern_id: 'PAT-001',
          customer_scale: '中堅企業',
          industry: '製造業',
          challenge: 'デジタル化',
          budget: '500万円以上',
          decision_period: '3ヶ月以内',
          historical_success_rate: 92,
          similarity_score: 0.75
        }
      ]),
      evaluatePatternRelevance: jest.fn()
    };

    const pattern_master = {
      'PAT-001': {
        pattern_id: 'PAT-001',
        customer_scale: '中堅企業',
        industry: '製造業',
        challenge: 'デジタル化',
        budget: '500万円以上',
        decision_period: '3ヶ月以内',
        historical_success_rate: 92,
        success_approach: '予算500万円以上のデジタル化案件向けの標準提案アプローチ'
      }
    };

    const threshold = 0.75;

    const result = evaluatePatternRelevance(
      current_deal_condition,
      pattern_id,
      mock_ai_engine,
      pattern_master,
      threshold
    );

    expect(result.adopted_pattern_id).toBe('PAT-001');
    expect(result.similarity_score).toBe(0.75);
    expect(result.is_adopted).toBe(true);
    expect(result.recommended_approach).toBe(
      '予算500万円以上のデジタル化案件向けの標準提案アプローチ'
    );
    expect(result.historical_success_rate).toBe(92);
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(
      current_deal_condition
    );
  });
});