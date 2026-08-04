import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - パターンマッチスコアが閾値直上のとき', () => {
  // SCEN-1958
  test('パターンマッチスコア0.76が閾値0.75を上回るため、成功パターンが適用済み状態で返却される', () => {
    const pattern_match_score = 0.76;
    const threshold = 0.75;
    const pattern_id = 'PAT-SUCCESS-001';
    const recommended_approach = '初期ヒアリング→提案資料作成→経営層説得資料生成';
    const customer_industry = '製造業';
    const customer_size = '中堅企業';
    const product_category = 'ERP';
    const budget_scale = 10000000;

    const deal_condition = {
      customer_industry: customer_industry,
      customer_size: customer_size,
      product_category: product_category,
      budget_scale: budget_scale,
    };

    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        match_score: pattern_match_score,
        is_applicable: true,
        confidence: 0.92,
      }),
    };

    const result = evaluatePatternRelevance(deal_condition, ai_engine_stub, threshold);

    expect(result.is_applicable).toBe(true);
    expect(result.match_score).toBe(0.76);
    expect(result.pattern_id).toBe(pattern_id);
    expect(result.recommended_approach).toBe(recommended_approach);
    expect(result.status).toBe('適用済み');
  });
});