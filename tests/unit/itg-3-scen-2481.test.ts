import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-2481: 成功パターンの適用可能性評価機能 - 適用不可能なパターンで低スコア返却', () => {
    // Setup: 新規案件データ（顧客業界：製造業、案件規模：小規模、購買決定者：現場担当者）
    const new_deal_data = {
      customer_industry: '製造業',
      deal_size: '小規模',
      decision_maker_level: '現場担当者'
    };

    // Setup: 過去の成功パターン（顧客業界：金融業、案件規模：大規模、購買決定者：経営層）
    const past_success_pattern = {
      customer_industry: '金融業',
      deal_size: '大規模',
      decision_maker_level: '経営層'
    };

    // Stub: AIRecommendationEngineのevaluatePatternRelevanceメソッドをスタブ化
    // 適用不可能なパターンに対して0.05のスコアを返すよう設定
    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.05)
    };

    // Execute: evaluatePatternRelevanceメソッドに新規案件データと過去成功パターンを渡す
    const relevance_score = evaluatePatternRelevance(
      new_deal_data,
      past_success_pattern,
      ai_engine_stub
    );

    // Assert: 適用可能性スコアが0以上0.1以下の範囲内で返却される
    expect(relevance_score).toBeGreaterThanOrEqual(0);
    expect(relevance_score).toBeLessThanOrEqual(0.1);
    // 期待値は0.05（スタブより返却される値）
    expect(relevance_score).toBe(0.05);
  });
});