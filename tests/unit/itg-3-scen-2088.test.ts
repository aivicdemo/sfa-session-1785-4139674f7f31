import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  test('SCEN-2088: AIエージェント生成履歴から抽出した成功パターンが新規案件の条件と照合される', () => {
    // Setup: テスト用の過去商談データ（成功事例5件）
    const historical_deals = [
      {
        deal_id: 'DEAL_001',
        customer_industry: '製造業',
        customer_challenge: '生産効率化',
        budget_range: '500-1000万円',
        decision_makers_count: 3,
        proposed_approach: '自動化ソリューション導入',
        contract_result: 'won',
        success_score: 0.95,
      },
      {
        deal_id: 'DEAL_002',
        customer_industry: '製造業',
        customer_challenge: '生産効率化',
        budget_range: '300-500万円',
        decision_makers_count: 2,
        proposed_approach: 'クラウド管理システム',
        contract_result: 'won',
        success_score: 0.92,
      },
      {
        deal_id: 'DEAL_003',
        customer_industry: '製造業',
        customer_challenge: 'サプライチェーン最適化',
        budget_range: '500-1000万円',
        decision_makers_count: 4,
        proposed_approach: 'ブロックチェーンソリューション',
        contract_result: 'won',
        success_score: 0.88,
      },
      {
        deal_id: 'DEAL_004',
        customer_industry: '流通業',
        customer_challenge: '在庫管理',
        budget_range: '200-500万円',
        decision_makers_count: 2,
        proposed_approach: 'AIベース予測モデル',
        contract_result: 'won',
        success_score: 0.85,
      },
      {
        deal_id: 'DEAL_005',
        customer_industry: '製造業',
        customer_challenge: '品質管理',
        budget_range: '500-1000万円',
        decision_makers_count: 3,
        proposed_approach: 'IoTセンサーシステム',
        contract_result: 'won',
        success_score: 0.90,
      },
    ];

    // Setup: 新規案件の条件
    const new_deal_condition = {
      customer_industry: '製造業',
      customer_challenge: '生産効率化',
      budget_range: '500万円',
      decision_makers_count: 3,
    };

    // Stub: AIRecommendationEngine.findSimilarPatterns
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        pattern_id: 'DEAL_001',
        pattern_name: '自動化ソリューション導入（製造業・生産効率化）',
        industry_match: true,
        challenge_similarity: 0.97,
        budget_match: true,
        ranking_order: 1,
        historical_data: historical_deals[0],
      },
      {
        pattern_id: 'DEAL_002',
        pattern_name: 'クラウド管理システム（製造業・生産効率化）',
        industry_match: true,
        challenge_similarity: 0.87,
        budget_match: false,
        ranking_order: 2,
        historical_data: historical_deals[1],
      },
      {
        pattern_id: 'DEAL_005',
        pattern_name: 'IoTセンサーシステム（製造業・品質管理）',
        industry_match: true,
        challenge_similarity: 0.65,
        budget_match: true,
        ranking_order: 3,
        historical_data: historical_deals[4],
      },
    ]);

    // Stub: AIRecommendationEngine.evaluatePatternRelevance
    const mockEvaluatePatternRelevance = jest.fn()
      .mockReturnValueOnce({ pattern_id: 'DEAL_001', applicability_score: 0.92 })
      .mockReturnValueOnce({ pattern_id: 'DEAL_002', applicability_score: 0.78 })
      .mockReturnValueOnce({ pattern_id: 'DEAL_005', applicability_score: 0.65 });

    // Stub: AIRecommendationEngine.generateRecommendation
    const mockGenerateRecommendation = jest.fn().mockReturnValue({
      primary_recommendation: {
        pattern_id: 'DEAL_001',
        pattern_name: '自動化ソリューション導入（製造業・生産効率化）',
        applicability_score: 0.92,
        condition_match_degree: {
          industry_match: true,
          challenge_similarity: 0.97,
          budget_match: true,
          decision_makers_alignment: true,
        },
        proposed_approach: '自動化ソリューション導入',
        rationale: [
          '過去事例 DEAL_001 と顧客業種が完全一致（製造業）',
          '課題の類似度が高い（生産効率化：0.97）',
          '予算帯が一致（500-1000万円）',
          '決定者数が同数（3名）',
          '過去成約率が高い（95%）',
        ],
      },
      alternative_recommendations: [
        {
          pattern_id: 'DEAL_002',
          pattern_name: 'クラウド管理システム（製造業・生産効率化）',
          applicability_score: 0.78,
          condition_match_degree: {
            industry_match: true,
            challenge_similarity: 0.87,
            budget_match: false,
            decision_makers_alignment: false,
          },
          proposed_approach: 'クラウド管理システム',
          rationale: [
            '顧客業種が一致（製造業）',
            '課題類似度が高い（生産効率化：0.87）',
            '予算帯が小さい（300-500万円）',
            '決定者数が少ない（2名）',
          ],
        },
        {
          pattern_id: 'DEAL_005',
          pattern_name: 'IoTセンサーシステム（製造業・品質管理）',
          applicability_score: 0.65,
          condition_match_degree: {
            industry_match: true,
            challenge_similarity: 0.65,
            budget_match: true,
            decision_makers_alignment: true,
          },
          proposed_approach: 'IoTセンサーシステム',
          rationale: [
            '顧客業種が一致（製造業）',
            '課題類似度が中程度（品質管理 → 生産効率化：0.65）',
            '予算帯が一致（500-1000万円）',
            '決定者数が同数（3名）',
          ],
        },
      ],
      execution_status: 'success',
      analysis_timestamp: new Date('2024-02-15T10:30:00Z').toISOString(),
    });

    const stub_engine = {
      generateRecommendation: mockGenerateRecommendation,
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    // Execute: 推奨生成処理を実行
    const result = generateRecommendation(new_deal_condition, stub_engine);

    // Verify: findSimilarPatterns が正しく呼ばれたか
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(new_deal_condition);
    expect(mockFindSimilarPatterns).toHaveBeenCalledTimes(1);

    // Verify: evaluatePatternRelevance が正しく呼ばれたか
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // Verify: generateRecommendation が正しく呼ばれたか
    expect(mockGenerateRecommendation).toHaveBeenCalledWith(new_deal_condition, stub_engine);
    expect(mockGenerateRecommendation).toHaveBeenCalledTimes(1);

    // Verify: 推奨結果の構造
    expect(result).toHaveProperty('primary_recommendation');
    expect(result).toHaveProperty('alternative_recommendations');
    expect(result).toHaveProperty('execution_status');
    expect(result).toHaveProperty('analysis_timestamp');

    // Verify: 最上位推奨パターンの検証
    expect(result.primary_recommendation.pattern_id).toBe('DEAL_001');
    expect(result.primary_recommendation.pattern_name).toBe('自動化ソリューション導入（製造業・生産効率化）');
    expect(result.primary_recommendation.applicability_score).toBe(0.92);
    expect(result.primary_recommendation.proposed_approach).toBe('自動化ソリューション導入');

    // Verify: 条件一致度の検証
    expect(result.primary_recommendation.condition_match_degree.industry_match).toBe(true);
    expect(result.primary_recommendation.condition_match_degree.challenge_similarity).toBe(0.97);
    expect(result.primary_recommendation.condition_match_degree.budget_match).toBe(true);
    expect(result.primary_recommendation.condition_match_degree.decision_makers_alignment).toBe(true);

    // Verify: 推奨根拠の検証
    expect(result.primary_recommendation.rationale).toHaveLength(5);
    expect(result.primary_recommendation.rationale[0]).toContain('DEAL_001');
    expect(result.primary_recommendation.rationale[0]).toContain('製造業');
    expect(result.primary_recommendation.rationale[2]).toContain('500-1000万円');
    expect(result.primary_recommendation.rationale[4]).toContain('95%');

    // Verify: 複数推奨パターンが適用可能性スコアの降順で並んでいる
    expect(result.alternative_recommendations).toHaveLength(2);
    expect(result.alternative_recommendations[0].applicability_score).toBe(0.78);
    expect(result.alternative_recommendations[1].applicability_score).toBe(0.65);

    // Verify: 各パターンが具体的な照合根拠を含んでいる
    expect(result.alternative_recommendations[0].rationale).toContain('顧客業種が一致（製造業）');
    expect(result.alternative_recommendations[0].rationale).toContain('課題類似度が高い（生産効率化：0.87）');
    expect(result.alternative_recommendations[1].rationale).toContain('顧客業種が一致（製造業）');

    // Verify: 実行ステータスと分析タイムスタンプ
    expect(result.execution_status).toBe('success');
    expect(result.analysis_timestamp).toBe('2024-02-15T10:30:00Z');

    // Verify: 標準プロセスの実行順序確認
    expect(mockFindSimilarPatterns.mock.invocationCallOrder[0]).toBeLessThan(
      mockEvaluatePatternRelevance.mock.invocationCallOrder[0],
    );
  });
});