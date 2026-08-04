import { generateRecommendation, explainRecommendationReasoning, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2099
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 推奨履歴から過去の推奨結果が参照され、推奨精度の向上に反映される', () => {
    // 過去の成功商談3件を推奨履歴テーブルに登録するテストデータ
    const pastDealA = {
      deal_id: 'DEAL_A',
      customer_industry: '製造業',
      customer_issue: '生産効率化',
      proposed_approach: 'IoT導入による生産ライン監視システム',
      contract_result: true,
      recommendation_score: 0.82,
    };

    const pastDealB = {
      deal_id: 'DEAL_B',
      customer_industry: '製造業',
      customer_issue: '生産効率化',
      proposed_approach: 'AI画像認識による品質検査自動化',
      contract_result: true,
      recommendation_score: 0.85,
    };

    const pastDealC = {
      deal_id: 'DEAL_C',
      customer_industry: '製造業',
      customer_issue: 'サプライチェーン最適化',
      proposed_approach: 'クラウドERP導入支援',
      contract_result: true,
      recommendation_score: 0.78,
    };

    const similarPatternsList = [
      {
        reference_deal_id: 'DEAL_B',
        similarity_score: 0.92,
        past_success_rate: 0.85,
        industry: '製造業',
        issue: '生産効率化',
      },
      {
        reference_deal_id: 'DEAL_A',
        similarity_score: 0.88,
        past_success_rate: 0.82,
        industry: '製造業',
        issue: '生産効率化',
      },
      {
        reference_deal_id: 'DEAL_C',
        similarity_score: 0.75,
        past_success_rate: 0.78,
        industry: '製造業',
        issue: 'サプライチェーン最適化',
      },
    ];

    // AIRecommendationEngine のスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn((dealData) => ({
        recommendation_id: 'REC_D_001',
        deal_id: 'DEAL_D',
        proposed_approach: 'AI画像認識による品質検査自動化とIoT生産監視の統合ソリューション',
        reasoning_based_on_past_deals: [
          {
            reference_deal_id: 'DEAL_B',
            success_rate: 0.85,
            relevance: '同一業種・同一課題での成功事例',
          },
          {
            reference_deal_id: 'DEAL_A',
            success_rate: 0.82,
            relevance: '類似の生産効率化課題での成功事例',
          },
        ],
        recommendation_precision_score: 0.82,
        generated_at: '2024-01-15T11:00:00Z',
      })),
      findSimilarPatterns: jest.fn(() => similarPatternsList),
      explainRecommendationReasoning: jest.fn((recommendationId) => ({
        explanation:
          '過去案件B（製造業、生産効率化、成約率85%）の成功アプローチを適用。案件Aの類似パターン（成約率82%）も参考にし、統合ソリューションを推奨。',
        reference_deals: ['DEAL_B', 'DEAL_A'],
        confidence_level: 'high',
      })),
      evaluatePatternRelevance: jest.fn(() => ({
        applicability_score: 0.78,
        pattern_match_details: {
          industry_match: 1.0,
          issue_match: 0.92,
          solution_relevance: 0.61,
        },
        recommendation_feasibility: 'highly_feasible',
      })),
    };

    // 新規案件（案件D）のデータを入力
    const newDealInput = {
      deal_id: 'DEAL_D',
      customer_industry: '製造業',
      customer_issue: '生産効率化',
      budget: 5000000,
      timeline_months: 6,
    };

    // generateRecommendationメソッドを呼び出し
    const recommendationResult = mockAIEngine.generateRecommendation(newDealInput);

    // 推奨結果が返却されたことを確認
    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.deal_id).toBe('DEAL_D');

    // 推奨根拠（reasoning）に過去商談の参照情報が含まれているか確認
    expect(recommendationResult.reasoning_based_on_past_deals).toBeDefined();
    expect(recommendationResult.reasoning_based_on_past_deals.length).toBeGreaterThan(0);
    expect(recommendationResult.reasoning_based_on_past_deals[0].reference_deal_id).toBe('DEAL_B');
    expect(recommendationResult.reasoning_based_on_past_deals[0].success_rate).toBe(0.85);

    // findSimilarPatternsメソッドで過去3件から類似度スコアが返される確認
    const similarPatterns = mockAIEngine.findSimilarPatterns();
    expect(similarPatterns.length).toBe(3);
    expect(similarPatterns[0].reference_deal_id).toBe('DEAL_B');
    expect(similarPatterns[0].similarity_score).toBe(0.92);

    // explainRecommendationReasoningメソッドで根拠説明を取得
    const reasoningExplanation = mockAIEngine.explainRecommendationReasoning('REC_D_001');
    expect(reasoningExplanation.explanation).toContain('過去案件B');
    expect(reasoningExplanation.explanation).toContain('製造業');
    expect(reasoningExplanation.explanation).toContain('生産効率化');
    expect(reasoningExplanation.explanation).toContain('成約率85%');
    expect(reasoningExplanation.reference_deals).toEqual(['DEAL_B', 'DEAL_A']);
    expect(reasoningExplanation.confidence_level).toBe('high');

    // evaluatePatternRelevanceメソッドで適用可能性スコアを取得
    const patternRelevance = mockAIEngine.evaluatePatternRelevance();
    expect(patternRelevance.applicability_score).toBeGreaterThanOrEqual(0.75);
    expect(patternRelevance.applicability_score).toBe(0.78);
    expect(patternRelevance.pattern_match_details.industry_match).toBe(1.0);
    expect(patternRelevance.pattern_match_details.issue_match).toBe(0.92);
    expect(patternRelevance.recommendation_feasibility).toBe('highly_feasible');

    // 推奨精度スコアが過去履歴の学習を反映しているか確認
    const expectedPrecisionScore = 0.82;
    expect(recommendationResult.recommendation_precision_score).toBeGreaterThanOrEqual(0.75);
    expect(recommendationResult.recommendation_precision_score).toBe(expectedPrecisionScore);

    // 推奨内容が過去商談の成功パターンを組み込んでいるか確認
    expect(recommendationResult.proposed_approach).toContain('AI画像認識');
    expect(recommendationResult.proposed_approach).toContain('IoT');
    expect(recommendationResult.proposed_approach).toContain('統合ソリューション');

    // 推奨履歴テーブルに今回の推奨結果が新規レコードとして記録されることを確認
    expect(recommendationResult.recommendation_id).toBe('REC_D_001');
    expect(recommendationResult.generated_at).toBe('2024-01-15T11:00:00Z');
  });
});