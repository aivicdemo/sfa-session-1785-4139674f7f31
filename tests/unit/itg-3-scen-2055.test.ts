import { findSimilarPatterns, generateRecommendation, evaluatePatternRelevance, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2055
  test('新規案件の顧客業種が欠落しているとき、金額と決定時期の条件でマッチングが行われる', () => {
    const newDealCondition = {
      customer_name: 'ABC企業',
      deal_amount: 5000000,
      decision_timing: '2026-Q1',
      customer_industry: null
    };

    const successPatterns = [
      {
        pattern_id: 'pat_001',
        industry: '小売',
        amount_min: 3000000,
        amount_max: 6000000,
        decision_timing: '2026-Q1',
        success_approach: '複数導入効果の提示'
      },
      {
        pattern_id: 'pat_002',
        industry: '製造',
        amount_min: 4000000,
        amount_max: 7000000,
        decision_timing: '2026-Q1',
        success_approach: '段階的導入プラン'
      },
      {
        pattern_id: 'pat_003',
        industry: 'サービス',
        amount_min: 4500000,
        amount_max: 5500000,
        decision_timing: '2026-Q1',
        success_approach: '導入後の効率化シミュレーション提示'
      }
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(successPatterns),
      generateRecommendation: jest.fn().mockReturnValue([
        {
          pattern_id: 'pat_001',
          recommended_approach: '複数導入効果の提示',
          reasoning_summary: '業種を問わず、金額帯と決定時期の一致により推奨'
        },
        {
          pattern_id: 'pat_002',
          recommended_approach: '段階的導入プラン',
          reasoning_summary: '業種を問わず、金額帯と決定時期の一致により推奨'
        },
        {
          pattern_id: 'pat_003',
          recommended_approach: '導入後の効率化シミュレーション提示',
          reasoning_summary: '業種を問わず、金額帯と決定時期の一致により推奨'
        }
      ]),
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.70)
        .mockReturnValueOnce(0.72),
      explainRecommendationReasoning: jest.fn()
        .mockReturnValueOnce('業種を問わず、金額帯（500万円）と決定時期（Q1）の一致により推奨')
        .mockReturnValueOnce('業種を問わず、金額帯（500万円）と決定時期（Q1）の一致により推奨')
        .mockReturnValueOnce('業種を問わず、金額帯（500万円）と決定時期（Q1）の一致により推奨')
    };

    const recommendations = generateRecommendation(newDealCondition, mockAIEngine);

    expect(recommendations).toHaveLength(3);
    expect(recommendations[0].pattern_id).toBe('pat_001');
    expect(recommendations[1].pattern_id).toBe('pat_002');
    expect(recommendations[2].pattern_id).toBe('pat_003');

    const relevance_score_1 = evaluatePatternRelevance(newDealCondition, successPatterns[0], mockAIEngine);
    const relevance_score_2 = evaluatePatternRelevance(newDealCondition, successPatterns[1], mockAIEngine);
    const relevance_score_3 = evaluatePatternRelevance(newDealCondition, successPatterns[2], mockAIEngine);

    expect(relevance_score_1).toBeGreaterThanOrEqual(0.6);
    expect(relevance_score_2).toBeGreaterThanOrEqual(0.6);
    expect(relevance_score_3).toBeGreaterThanOrEqual(0.6);
    expect(relevance_score_1).toBe(0.75);
    expect(relevance_score_2).toBe(0.70);
    expect(relevance_score_3).toBe(0.72);

    const reasoning_1 = explainRecommendationReasoning(recommendations[0], mockAIEngine);
    const reasoning_2 = explainRecommendationReasoning(recommendations[1], mockAIEngine);
    const reasoning_3 = explainRecommendationReasoning(recommendations[2], mockAIEngine);

    expect(reasoning_1).toMatch(/業種を問わず/);
    expect(reasoning_1).toMatch(/金額帯/);
    expect(reasoning_1).toMatch(/決定時期/);
    expect(reasoning_2).toMatch(/業種を問わず/);
    expect(reasoning_2).toMatch(/金額帯/);
    expect(reasoning_2).toMatch(/決定時期/);
    expect(reasoning_3).toMatch(/業種を問わず/);
    expect(reasoning_3).toMatch(/金額帯/);
    expect(reasoning_3).toMatch(/決定時期/);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition, expect.anything());
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});