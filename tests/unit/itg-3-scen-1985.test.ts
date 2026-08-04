import { generatePersuasionMaterial } from '../../src/logic/it-1-br-3-3-2-1';

describe('経営層向け説得資料の自動生成機能', () => {
  // SCEN-1985
  test('複数の成功パターンが適用可能な提案について、全ての適用可能パターンが説得資料に表示される', () => {
    const customer_info = {
      industry: '製造業',
      employee_count: 500,
      business_challenge: 'デジタル化推進',
    };

    const proposal_content = {
      products: ['ERP導入', 'クラウド移行', '業務自動化'],
      estimated_investment: 50000000,
      expected_roi: 0.35,
    };

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: 'pattern_a',
          pattern_name: 'ERP導入による工程短縮',
          similarity_score: 0.92,
          industry: '製造業',
          company_size: 'large',
        },
        {
          pattern_id: 'pattern_b',
          pattern_name: 'クラウド移行による運用コスト削減',
          similarity_score: 0.88,
          industry: '製造業',
          company_size: 'medium',
        },
        {
          pattern_id: 'pattern_c',
          pattern_name: '業務自動化による人員効率化',
          similarity_score: 0.85,
          industry: '製造業',
          company_size: 'large',
        },
      ]),
      evaluatePatternRelevance: jest.fn((pattern_id: string) => {
        const scores: Record<string, number> = {
          pattern_a: 0.92,
          pattern_b: 0.88,
          pattern_c: 0.85,
        };
        return scores[pattern_id] ?? 0.0;
      }),
      explainRecommendationReasoning: jest.fn((pattern_id: string) => {
        const explanations: Record<string, string> = {
          pattern_a: '同業他社での導入実績により平均30%の工程短縮を実現',
          pattern_b: '同業他社での導入により平均25%の運用コスト削減を実現',
          pattern_c: '同業他社での導入により平均20%の人員効率化を実現',
        };
        return explanations[pattern_id] ?? '';
      }),
    };

    const result = generatePersuasionMaterial(
      customer_info,
      proposal_content,
      mock_ai_engine
    );

    expect(result.applicable_patterns_count).toBe(3);
    expect(result.applicable_patterns).toHaveLength(3);

    expect(result.applicable_patterns[0]).toEqual({
      pattern_id: 'pattern_a',
      pattern_name: 'ERP導入による工程短縮',
      relevance_score: 0.92,
      reasoning: '同業他社での導入実績により平均30%の工程短縮を実現',
      industry_benchmark: '平均30%の工程短縮',
    });

    expect(result.applicable_patterns[1]).toEqual({
      pattern_id: 'pattern_b',
      pattern_name: 'クラウド移行による運用コスト削減',
      relevance_score: 0.88,
      reasoning: '同業他社での導入により平均25%の運用コスト削減を実現',
      industry_benchmark: '平均25%の運用コスト削減',
    });

    expect(result.applicable_patterns[2]).toEqual({
      pattern_id: 'pattern_c',
      pattern_name: '業務自動化による人員効率化',
      relevance_score: 0.85,
      reasoning: '同業他社での導入により平均20%の人員効率化を実現',
      industry_benchmark: '平均20%の人員効率化',
    });

    expect(result.applicable_patterns[0].relevance_score).toBeGreaterThan(
      result.applicable_patterns[1].relevance_score
    );
    expect(result.applicable_patterns[1].relevance_score).toBeGreaterThan(
      result.applicable_patterns[2].relevance_score
    );

    expect(result.persuasion_material).toContain('適用可能パターン数：3件');
    expect(result.persuasion_material).toContain('ERP導入による工程短縮');
    expect(result.persuasion_material).toContain('クラウド移行による運用コスト削減');
    expect(result.persuasion_material).toContain('業務自動化による人員効率化');
    expect(result.persuasion_material).toContain(
      '同業他社での導入実績により平均30%の工程短縮を実現'
    );
    expect(result.persuasion_material).toContain(
      '同業他社での導入により平均25%の運用コスト削減を実現'
    );
    expect(result.persuasion_material).toContain(
      '同業他社での導入により平均20%の人員効率化を実現'
    );
  });
});