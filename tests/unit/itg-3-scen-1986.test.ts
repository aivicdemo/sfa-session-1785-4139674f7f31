import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料の自動生成', () => {
  // SCEN-1986
  test('提案の顧客適合性スコアが説得資料の妥当性評価に正確に反映される', async () => {
    // ========== Setup: Test Data ==========
    const customer_info = {
      industry: '製造業',
      company_size: '中堅',
      budget_jpy: 5000000,
      decision_makers_count: 3,
    };

    const proposal_content = {
      system_name: '業務効率化ツール',
      implementation_period_months: 6,
      roi_forecast_percentage: 30,
    };

    // ========== Test Case 1: High Score (0.85) ==========
    const mock_engine_high_score = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-high-001',
        customer_fit_score: 0.85,
        evaluation_comment: '顧客ニーズとの適合性が高い',
        proposal_content: proposal_content,
        supporting_evidence: [
          { factor: 'ROI適合度', match_rate: 0.9 },
          { factor: '導入期間適合度', match_rate: 0.8 },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('高い適合度の説明'),
    };

    const result_high = await generateRecommendation(
      customer_info,
      proposal_content,
      mock_engine_high_score
    );

    expect(result_high.customer_fit_score).toBe(0.85);
    expect(result_high.evaluation_comment).toBe('顧客ニーズとの適合性が高い');
    expect(result_high.evaluation_comment).toMatch(/適合性が高い/);

    // ========== Test Case 2: Medium Score (0.65) ==========
    const mock_engine_medium_score = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-medium-001',
        customer_fit_score: 0.65,
        evaluation_comment: '条件付き適用可能',
        proposal_content: proposal_content,
        supporting_evidence: [
          { factor: 'ROI適合度', match_rate: 0.7 },
          { factor: '導入期間適合度', match_rate: 0.6 },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.65),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('中程度適合度の説明'),
    };

    const result_medium = await generateRecommendation(
      customer_info,
      proposal_content,
      mock_engine_medium_score
    );

    expect(result_medium.customer_fit_score).toBe(0.65);
    expect(result_medium.evaluation_comment).toBe('条件付き適用可能');
    expect(result_medium.evaluation_comment).toMatch(/条件付き/);

    // ========== Test Case 3: Low Score (0.35) ==========
    const mock_engine_low_score = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-low-001',
        customer_fit_score: 0.35,
        evaluation_comment: '別提案の検討が推奨',
        proposal_content: proposal_content,
        supporting_evidence: [
          { factor: 'ROI適合度', match_rate: 0.4 },
          { factor: '導入期間適合度', match_rate: 0.3 },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.35),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('低い適合度の説明'),
    };

    const result_low = await generateRecommendation(
      customer_info,
      proposal_content,
      mock_engine_low_score
    );

    expect(result_low.customer_fit_score).toBe(0.35);
    expect(result_low.evaluation_comment).toBe('別提案の検討が推奨');
    expect(result_low.evaluation_comment).toMatch(/別提案/);

    // ========== Verification: Score-to-Comment Mapping ==========
    // Test Case 1: Score >= 0.75 → High compatibility
    expect(result_high.customer_fit_score).toBeGreaterThanOrEqual(0.75);
    expect(result_high.evaluation_comment).toMatch(/適合性が高い/);

    // Test Case 2: 0.5 <= Score < 0.75 → Conditional compatibility
    expect(result_medium.customer_fit_score).toBeGreaterThanOrEqual(0.5);
    expect(result_medium.customer_fit_score).toBeLessThan(0.75);
    expect(result_medium.evaluation_comment).toMatch(/条件付き/);

    // Test Case 3: Score < 0.5 → Alternative proposal recommended
    expect(result_low.customer_fit_score).toBeLessThan(0.5);
    expect(result_low.evaluation_comment).toMatch(/別提案/);

    // ========== Cross-case Consistency Check ==========
    const all_results = [result_high, result_medium, result_low];
    const score_comment_mappings = [
      { score: 0.85, expected_pattern: /適合性が高い/ },
      { score: 0.65, expected_pattern: /条件付き/ },
      { score: 0.35, expected_pattern: /別提案/ },
    ];

    for (let i = 0; i < all_results.length; i++) {
      const result = all_results[i];
      const mapping = score_comment_mappings[i];
      expect(result.customer_fit_score).toBe(mapping.score);
      expect(result.evaluation_comment).toMatch(mapping.expected_pattern);
    }

    // ========== Metadata Consistency ==========
    // Verify that internal score records match extracted scores
    expect(result_high.customer_fit_score).toBe(
      mock_engine_high_score.evaluatePatternRelevance()
    );
    expect(result_medium.customer_fit_score).toBe(
      mock_engine_medium_score.evaluatePatternRelevance()
    );
    expect(result_low.customer_fit_score).toBe(
      mock_engine_low_score.evaluatePatternRelevance()
    );
  });
});