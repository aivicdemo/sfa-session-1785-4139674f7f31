import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを推奨する', () => {
  // SCEN-1597
  test('類似顧客マッチング処理 - 過去顧客データが0件のとき、空の特定顧客群が返却される', () => {
    const new_deal_condition = {
      customer_industry: '製造業',
      customer_size: 'large',
      deal_amount: 5000000,
      deal_stage: '提案段階',
    };

    const empty_past_customers = [];

    const ai_engine_stub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = findSimilarPatterns(
      new_deal_condition,
      empty_past_customers,
      ai_engine_stub
    );

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});