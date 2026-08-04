import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1540: [normal] 推奨内容の根拠表示機能 - 複数の成功パターンが適用可能な場合、全ての根拠がマルチ選択肢として表示される
  test('複数の成功パターンが適用可能な場合、全ての根拠がマルチ選択肢として表示される', () => {
    const recommendation_id = 'rec-20240115-001';
    const customer_industry = '製造業';
    const customer_scale = '中堅企業';
    const purchase_stage = '検討中';

    const mock_ai_engine = {
      generateRecommendation: jest.fn(() => ({
        recommendation_id: recommendation_id,
        patterns: [
          {
            pattern_id: 'pattern_A',
            pattern_name: 'パターンA',
            category: '顧客規模',
            description: '中堅企業向け提案アプローチ',
            match_score: 95,
          },
          {
            pattern_id: 'pattern_B',
            pattern_name: 'パターンB',
            category: '業界別',
            description: '製造業向けソリューション',
            match_score: 92,
          },
          {
            pattern_id: 'pattern_C',
            pattern_name: 'パターンC',
            category: '購買段階別',
            description: '検討中段階の顧客フォローアップ',
            match_score: 88,
          },
        ],
      })),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input_customer_info = {
      industry: customer_industry,
      scale: customer_scale,
      purchase_stage: purchase_stage,
    };

    const result = explainRecommendationReasoning(
      recommendation_id,
      input_customer_info,
      mock_ai_engine
    );

    expect(result).toBeDefined();
    expect(result.recommendation_id).toBe('rec-20240115-001');
    expect(result.reasoning_items).toHaveLength(3);

    expect(result.reasoning_items[0]).toEqual({
      pattern_id: 'pattern_A',
      pattern_name: 'パターンA',
      category: '顧客規模',
      description: '中堅企業向け提案アプローチ',
      match_score: 95,
      display_text: 'パターンA：顧客規模（中堅企業向け提案アプローチ）- マッチ度95%',
    });

    expect(result.reasoning_items[1]).toEqual({
      pattern_id: 'pattern_B',
      pattern_name: 'パターンB',
      category: '業界別',
      description: '製造業向けソリューション',
      match_score: 92,
      display_text: 'パターンB：業界別（製造業向けソリューション）- マッチ度92%',
    });

    expect(result.reasoning_items[2]).toEqual({
      pattern_id: 'pattern_C',
      pattern_name: 'パターンC',
      category: '購買段階別',
      description: '検討中段階の顧客フォローアップ',
      match_score: 88,
      display_text: 'パターンC：購買段階別（検討中段階の顧客フォローアップ）- マッチ度88%',
    });

    expect(result.selectable_format).toBe('multi_choice');
    expect(result.reasoning_items.every((item) => item.match_score > 0)).toBe(true);
    expect(result.reasoning_items.every((item) => item.match_score <= 100)).toBe(true);
  });
});