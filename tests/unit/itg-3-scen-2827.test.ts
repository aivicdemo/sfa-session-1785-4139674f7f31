import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック - 重複レコード処理', () => {
  // SCEN-2827
  test('should deduplicate identical past deal records and normalize weighting score to 1.0 for single pattern', async () => {
    // 手順1: テストデータ準備 - 同一顧客、同一日時、同一結果の重複レコード3件
    const duplicateDealRecord = {
      customer_id: 'CUST-001',
      deal_timestamp: '2026-01-15T10:00:00Z',
      result: 'success',
      outcome_value: 150000,
    };

    const pastDealsWithDuplicates = [
      duplicateDealRecord,
      duplicateDealRecord,
      duplicateDealRecord,
    ];

    // 手順2: AIRecommendationEngineのスタブ設定
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue(pastDealsWithDuplicates),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 手順3-5: findSimilarPatternsを呼び出し、重複排除と重み付けスコア計算を実行
    const currentDealCondition = {
      customer_id: 'CUST-001',
      industry: 'technology',
      company_size: 'large',
      budget_range: 'high',
    };

    const result = await findSimilarPatterns(
      currentDealCondition,
      aiEngineStub,
    );

    // 手順6: パターンマッチングの集約結果を検証
    // 期待結果: 重複レコード3件が1件としてカウントされている
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      customer_id: 'CUST-001',
      deal_timestamp: '2026-01-15T10:00:00Z',
      result: 'success',
      outcome_value: 150000,
      occurrence_count: 1,
      normalized_weighting_score: 1.0,
    });

    // 手順6: 出現頻度が3ではなく1としてカウントされていることを確認
    expect(result[0].occurrence_count).toBe(1);

    // 手順7: 重複排除後の正規化スコアが1.0であることを確認
    expect(result[0].normalized_weighting_score).toBe(1.0);
  });
});