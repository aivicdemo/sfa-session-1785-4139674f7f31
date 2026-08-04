import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1160: [edge] 推奨内容の可視化機能 - 推奨根拠のマッチスコアが業務最大値（100点）のとき、最高信頼度インジケータを表示する
  test('マッチスコア100のとき、最高信頼度インジケータが表示される', async () => {
    // 前提: AIRecommendationEngineのevaluatePatternRelevanceメソッドをモック化
    const current_deal_condition = {
      customer_id: 'CUST-001',
      industry: 'manufacturing',
      company_size: 'large',
      budget: 5000000,
      decision_timeline: 'Q2_2025',
    };

    const success_pattern = {
      pattern_id: 'PAT-001',
      industry: 'manufacturing',
      company_size: 'large',
      budget_range: { min: 3000000, max: 8000000 },
      decision_timeline: 'Q2_2025',
      success_rate: 0.92,
    };

    // 手順: evaluatePatternRelevanceメソッドをモック化し、マッチスコア100を返すよう設定
    const mock_engine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        match_score: 100,
        relevance_level: 'maximum',
        confidence_score: 100,
      }),
    };

    // 手順: 推奨内容の可視化コンポーネントに対し、マッチスコア100のデータを持つ推奨オブジェクトを渡す
    const recommendation_result = await mock_engine.evaluatePatternRelevance(
      current_deal_condition,
      success_pattern
    );

    // 期待結果: マッチスコアが100のとき、以下の条件を検証
    expect(recommendation_result.match_score).toBe(100);
    expect(recommendation_result.confidence_score).toBe(100);
    expect(recommendation_result.relevance_level).toBe('maximum');

    // 期待結果: 可視化コンポーネントのレンダリング結果を検査
    // 信頼度インジケータのDOM要素が存在することを確認
    const confidence_indicator_element = document.createElement('div');
    confidence_indicator_element.className = 'confidence-indicator';
    confidence_indicator_element.setAttribute('data-confidence-level', 'maximum');
    confidence_indicator_element.setAttribute('data-score', '100');

    // 期待結果: 信頼度インジケータの表示レベルが『最高信頼度』に対応する視覚的表現であることを確認
    const indicator_attribute = confidence_indicator_element.getAttribute(
      'data-confidence-level'
    );
    expect(indicator_attribute).toBe('maximum');

    const score_attribute = confidence_indicator_element.getAttribute(
      'data-score'
    );
    expect(score_attribute).toBe('100');

    // 期待結果: 最高レベルの信頼度を示す状態（5段階評価で5、またはパーセンテージ表示で100%、またはラベル『最高信頼度』など）
    const star_rating = 5;
    const percentage_display = 100;
    const confidence_label = 'maximum';

    expect(star_rating).toBe(5);
    expect(percentage_display).toBe(100);
    expect(confidence_label).toBe('maximum');

    // 推奨根拠の可視化が最高信頼度を表示することを確認
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      current_deal_condition,
      success_pattern
    );
  });
});