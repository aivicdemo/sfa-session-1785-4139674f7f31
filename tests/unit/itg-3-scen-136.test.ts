import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件照合機能', () => {
  // SCEN-136
  test('複数件の成功パターンが抽出される場合、推論実行時に複数パターンを含む推奨結果が返却されること', () => {
    const pastDealData = [
      {
        deal_id: 'deal_001',
        customer_industry: '製造業',
        customer_size: '大企業',
        product_category: '生産管理システム',
        proposal_approach: 'リスク軽減重視',
        contract_result: 'won',
        deal_amount: 5000000,
      },
      {
        deal_id: 'deal_002',
        customer_industry: '製造業',
        customer_size: '大企業',
        product_category: 'IoTセンサー',
        proposal_approach: 'ROI最大化重視',
        contract_result: 'won',
        deal_amount: 8000000,
      },
      {
        deal_id: 'deal_003',
        customer_industry: '製造業',
        customer_size: '中堅企業',
        product_category: '生産管理システム',
        proposal_approach: 'コスト削減重視',
        contract_result: 'won',
        deal_amount: 2000000,
      },
      {
        deal_id: 'deal_004',
        customer_industry: '製造業',
        customer_size: '中堅企業',
        product_category: 'クラウド化',
        proposal_approach: 'デジタル変革支援',
        contract_result: 'won',
        deal_amount: 1500000,
      },
      {
        deal_id: 'deal_005',
        customer_industry: '製造業',
        customer_size: '大企業',
        product_category: 'サプライチェーン最適化',
        proposal_approach: 'グローバル対応',
        contract_result: 'won',
        deal_amount: 12000000,
      },
    ];

    const newDealData = {
      customer_industry: '製造業',
      customer_size: '大企業',
      customer_challenge: '生産効率の向上とコスト最適化',
      deal_stage: 'initial_contact',
      budget_range: '3000000-10000000',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          deal_id: 'deal_001',
          similarity_score: 0.92,
          pattern_label: 'pattern_1',
        },
        {
          deal_id: 'deal_002',
          similarity_score: 0.85,
          pattern_label: 'pattern_2',
        },
        {
          deal_id: 'deal_005',
          similarity_score: 0.78,
          pattern_label: 'pattern_3',
        },
      ]),
      evaluatePatternRelevance: jest.fn((pattern) => {
        const scoreMap: Record<string, number> = {
          pattern_1: 0.92,
          pattern_2: 0.85,
          pattern_3: 0.78,
        };
        return scoreMap[pattern.pattern_label] || 0.0;
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'パターン1（リスク軽減重視）: 過去事例deal_001で同規模大企業への提案で成功。' +
          'パターン2（ROI最大化重視）: deal_002で予算範囲内での高額案件達成。' +
          'パターン3（グローバル対応）: deal_005でスケール型提案の実績あり。'
      ),
      generateRecommendation: jest.fn().mockReturnValue({
        status: 'success',
        patterns_detected: 3,
        patterns: [
          {
            pattern_id: 'pattern_1',
            source_deal_id: 'deal_001',
            relevance_score: 0.92,
            proposal_approach: 'リスク軽減重視',
            basis: '同業種・同規模での成功実績。予算範囲と合致。',
          },
          {
            pattern_id: 'pattern_2',
            source_deal_id: 'deal_002',
            relevance_score: 0.85,
            proposal_approach: 'ROI最大化重視',
            basis: 'IoT導入による業務効率化で実績。中・高予算層対応実績。',
          },
          {
            pattern_id: 'pattern_3',
            source_deal_id: 'deal_005',
            relevance_score: 0.78,
            proposal_approach: 'グローバル対応',
            basis: '大規模システム導入の成功例。国際展開対応能力実績。',
          },
        ],
        reasoning: 'パターン1（リスク軽減重視）: 過去事例deal_001で同規模大企業への提案で成功。' +
          'パターン2（ROI最大化重視）: deal_002で予算範囲内での高額案件達成。' +
          'パターン3（グローバル対応）: deal_005でスケール型提案の実績あり。',
        inference_confidence: 0.85,
        log_entry: '複数パターン検出: 3件',
      }),
    };

    const result = generateRecommendation(
      newDealData,
      pastDealData,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('success');
    expect(result.patterns_detected).toBe(3);
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeGreaterThanOrEqual(3);

    result.patterns.forEach((pattern) => {
      expect(pattern.pattern_id).toBeDefined();
      expect(pattern.source_deal_id).toBeDefined();
      expect(typeof pattern.relevance_score).toBe('number');
      expect(pattern.relevance_score).toBeGreaterThanOrEqual(0.0);
      expect(pattern.relevance_score).toBeLessThanOrEqual(1.0);
      expect(typeof pattern.proposal_approach).toBe('string');
      expect(pattern.proposal_approach.length).toBeGreaterThan(0);
      expect(typeof pattern.basis).toBe('string');
      expect(pattern.basis.length).toBeGreaterThan(0);
    });

    expect(result.patterns[0].relevance_score).toBe(0.92);
    expect(result.patterns[1].relevance_score).toBe(0.85);
    expect(result.patterns[2].relevance_score).toBe(0.78);

    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);
    expect(result.reasoning).toContain('パターン1');
    expect(result.reasoning).toContain('パターン2');
    expect(result.reasoning).toContain('パターン3');

    expect(result.inference_confidence).toBe(0.85);
    expect(result.log_entry).toContain('複数パターン検出');
    expect(result.log_entry).toContain('3件');

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalled();
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalled();
  });
});