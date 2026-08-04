import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1554
  test('OpenAI API失敗時、内部推奨パターンマスタから統計的に上位の成功パターンと提案アプローチが返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValueOnce(
        new Error('Network timeout')
      ),
    };

    const internalPatternMaster = [
      {
        pattern_id: 'PATTERN_A',
        success_count: 120,
        statistical_score: 0.92,
        proposal_approach: '提案書のカスタマイズ版テンプレート',
        customer_type: '製造業',
        budget_range: '500万円',
        decision_makers: 3,
      },
      {
        pattern_id: 'PATTERN_B',
        success_count: 85,
        statistical_score: 0.88,
        proposal_approach: '複数決定者向けの段階的説得シナリオ',
        customer_type: '製造業',
        budget_range: '500万円',
        decision_makers: 3,
      },
      {
        pattern_id: 'PATTERN_C',
        success_count: 45,
        statistical_score: 0.71,
        proposal_approach: '標準提案フロー',
        customer_type: '製造業',
        budget_range: '500万円',
        decision_makers: 3,
      },
    ];

    const newCaseInput = {
      customer_industry: '製造業',
      budget_scale: '500万円',
      decision_maker_count: 3,
    };

    const result = await generateRecommendation(
      newCaseInput,
      mockAIEngine,
      internalPatternMaster
    );

    expect(result.recommendation_patterns).toHaveLength(2);
    expect(result.recommendation_patterns[0].pattern_id).toBe('PATTERN_A');
    expect(result.recommendation_patterns[0].statistical_score).toBe(0.92);
    expect(result.recommendation_patterns[0].success_count).toBe(120);
    expect(result.recommendation_patterns[0].proposal_approach).toBe(
      '提案書のカスタマイズ版テンプレート'
    );

    expect(result.recommendation_patterns[1].pattern_id).toBe('PATTERN_B');
    expect(result.recommendation_patterns[1].statistical_score).toBe(0.88);
    expect(result.recommendation_patterns[1].success_count).toBe(85);
    expect(result.recommendation_patterns[1].proposal_approach).toBe(
      '複数決定者向けの段階的説得シナリオ'
    );

    expect(result.reasoning_explanation).toBe('過去成功パターンに基づく推奨です');
    expect(result.fallback_applied).toBe(true);
  });
});