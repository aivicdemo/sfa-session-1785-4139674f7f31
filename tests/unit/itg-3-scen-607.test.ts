import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動抽出・提案アプローチ推奨機能', () => {
  // SCEN-607
  test('新規顧客が過去成功パターンと完全マッチする条件のとき該当アプローチが推奨される', () => {
    const past_success_pattern = {
      pattern_id: 'PATTERN-001',
      industry: '製造業',
      company_size_employees: 500,
      product_category: '生産管理システム',
      recommended_approach: '経営層向けROI説明会開催',
    };

    const new_customer_condition = {
      industry: '製造業',
      company_size_employees: 480,
      product_category: '生産管理システム',
      current_status: '初期接触',
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        similarity_score: 0.95,
        matched_patterns: [past_success_pattern],
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        recommended_approach: '経営層向けROI説明会開催',
        pattern_id: 'PATTERN-001',
        match_basis: '業界・規模・商材が合致',
        match_level: '完全マッチ',
        reasoning_text: '業界・企業規模・商材の3つの条件が過去成功事例と一致しているため、経営層向けROI説明会開催アプローチが最適と判定されました。',
        confidence_score: 95,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendation(new_customer_condition, mock_ai_engine);

    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(new_customer_condition);
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(new_customer_condition);

    expect(result).toHaveProperty('recommended_approach');
    expect(result.recommended_approach).toBe('経営層向けROI説明会開催');

    expect(result).toHaveProperty('match_level');
    expect(result.match_level).toBe('完全マッチ');

    expect(result).toHaveProperty('pattern_id');
    expect(result.pattern_id).toBe('PATTERN-001');

    expect(result).toHaveProperty('reasoning_text');
    expect(result.reasoning_text).toContain('業界・企業規模・商材の3つの条件が過去成功事例と一致');

    expect(result).toHaveProperty('confidence_score');
    expect(result.confidence_score).toBe(95);
  });
});