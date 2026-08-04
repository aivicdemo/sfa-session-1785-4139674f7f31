import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2052
  test('適用可能な成功パターン候補が0件のとき、エラーメッセージが返却される', async () => {
    const new_deal_input = {
      customer_industry: 'IT',
      budget_scale_jpy: 5000000,
      deal_stage: '初期接触'
    };

    const stub_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicable_count: 0,
        relevance_score: 0
      })
    };

    try {
      await findSimilarPatterns(new_deal_input, stub_ai_engine);
      fail('Expected function to throw an error');
    } catch (error) {
      expect(error).toMatchObject({
        status_code: 400,
        error_code: 'NO_APPLICABLE_PATTERNS',
        error_message: '適用可能な成功パターンが見つかりません。より詳細な商談条件をご入力ください。',
        detail_field: {
          matched_pattern_count: 0
        }
      });
    }
  });

  test('適用可能な成功パターン候補が0件のとき、フォールバックパターンが返却される', async () => {
    const new_deal_input = {
      customer_industry: 'IT',
      budget_scale_jpy: 5000000,
      deal_stage: '初期接触'
    };

    const fallback_patterns_data = [
      {
        pattern_id: 'PATTERN_001',
        pattern_name: '小規模IT企業向け基本提案',
        success_rate: 0.68,
        brief_reasoning: 'IT業界の初期接触段階では基本機能説明が有効'
      },
      {
        pattern_id: 'PATTERN_002',
        pattern_name: 'ROI重視型提案',
        success_rate: 0.65,
        brief_reasoning: '予算制約のある顧客には投資対効果の明示が効果的'
      },
      {
        pattern_id: 'PATTERN_003',
        pattern_name: '段階的導入提案',
        success_rate: 0.62,
        brief_reasoning: 'リスク回避志向の顧客には段階的な実装計画が信頼を獲得'
      }
    ];

    const stub_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicable_count: 0,
        relevance_score: 0,
        fallback_patterns: fallback_patterns_data
      })
    };

    const result = await evaluatePatternRelevance(new_deal_input, stub_ai_engine);

    expect(result).toMatchObject({
      status_code: 400,
      error_code: 'NO_APPLICABLE_PATTERNS',
      matched_pattern_count: 0,
      fallback_patterns: expect.arrayContaining([
        expect.objectContaining({
          pattern_id: 'PATTERN_001',
          pattern_name: '小規模IT企業向け基本提案',
          success_rate: 0.68,
          brief_reasoning: 'IT業界の初期接触段階では基本機能説明が有効'
        }),
        expect.objectContaining({
          pattern_id: 'PATTERN_002',
          pattern_name: 'ROI重視型提案',
          success_rate: 0.65,
          brief_reasoning: '予算制約のある顧客には投資対効果の明示が効果的'
        }),
        expect.objectContaining({
          pattern_id: 'PATTERN_003',
          pattern_name: '段階的導入提案',
          success_rate: 0.62,
          brief_reasoning: 'リスク回避志向の顧客には段階的な実装計画が信頼を獲得'
        })
      ])
    });
    expect(result.fallback_patterns).toHaveLength(3);
  });
});