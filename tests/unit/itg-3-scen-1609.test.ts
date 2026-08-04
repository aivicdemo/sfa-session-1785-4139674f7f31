import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理 - 複数カテゴリ一致度計算', () => {
  // SCEN-1609
  test('購買履歴に異なるカテゴリの商品が複数含まれるとき、すべてのカテゴリが一致度計算に反映される', async () => {
    // テスト対象：類似顧客マッチング処理
    // 入力：複数カテゴリを含む顧客購買履歴
    const customer_purchase_history = {
      purchase_categories: ['electronics', 'cosmetics', 'apparel']
    };

    // スタブ：過去成功パターン
    const past_pattern_a = {
      pattern_id: 'A',
      categories: ['electronics', 'cosmetics'],
      success_count: 45
    };

    const past_pattern_b = {
      pattern_id: 'B',
      categories: ['electronics', 'cosmetics', 'apparel'],
      success_count: 62
    };

    const past_pattern_c = {
      pattern_id: 'C',
      categories: ['electronics'],
      success_count: 28
    };

    // AIRecommendationEngineのスタブ
    const ai_engine_stub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        past_pattern_a,
        past_pattern_b,
        past_pattern_c
      ])
    };

    // 類似顧客マッチング処理を実行
    const result = await findSimilarPatterns(
      customer_purchase_history,
      ai_engine_stub
    );

    // 検証1：パターンBが3カテゴリ一致で最高スコア
    // 計算: パターンB一致数 3 / 入力カテゴリ数 3 = 100% 一致度
    const pattern_b_score = result.find((r: any) => r.pattern_id === 'B')?.similarity_score;
    expect(pattern_b_score).toBe(100);

    // 検証2：パターンAが2カテゴリ一致で中程度スコア
    // 計算: パターンA一致数 2 / 入力カテゴリ数 3 = 66.67% 一致度
    const pattern_a_score = result.find((r: any) => r.pattern_id === 'A')?.similarity_score;
    expect(Math.round(pattern_a_score * 100) / 100).toBe(66.67);

    // 検証3：パターンCが1カテゴリ一致で最低スコア
    // 計算: パターンC一致数 1 / 入力カテゴリ数 3 = 33.33% 一致度
    const pattern_c_score = result.find((r: any) => r.pattern_id === 'C')?.similarity_score;
    expect(Math.round(pattern_c_score * 100) / 100).toBe(33.33);

    // 検証4：スコア順が『パターンB ≥ パターンA > パターンC』
    expect(pattern_b_score).toBeGreaterThanOrEqual(pattern_a_score);
    expect(pattern_a_score).toBeGreaterThan(pattern_c_score);

    // 検証5：すべての購買カテゴリが一致度計算に反映されたことを確認
    // 結果配列の長さが3（全パターン数）であり、各パターンが計算されている
    expect(result).toHaveLength(3);
    expect(result.map((r: any) => r.pattern_id)).toEqual(['B', 'A', 'C']);

    // 検証6：AIエンジンが呼び出されたことを確認
    expect(ai_engine_stub.findSimilarPatterns).toHaveBeenCalledWith(
      customer_purchase_history
    );
  });
});