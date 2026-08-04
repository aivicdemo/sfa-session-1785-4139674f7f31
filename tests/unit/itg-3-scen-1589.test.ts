import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能 - AIエージェント呼び出し失敗時の代替処理', () => {
  // SCEN-1589
  test('AIRecommendationEngine呼び出し失敗時に3回指数バックオフ再試行を実行し、推奨パターンマスタから統計上位パターンを返却する', async () => {
    const mockAiEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        pattern_id: 'PAT-001',
        success_rate: 0.92,
        customer_industry: 'manufacturing',
        deal_value_range: '1000000-5000000',
        proposal_approach: 'solution_oriented',
        reasoning_brief: '製造業向け大型案件',
      },
      {
        pattern_id: 'PAT-002',
        success_rate: 0.88,
        customer_industry: 'manufacturing',
        deal_value_range: '1000000-5000000',
        proposal_approach: 'cost_reduction',
        reasoning_brief: 'コスト削減効果',
      },
      {
        pattern_id: 'PAT-003',
        success_rate: 0.85,
        customer_industry: 'retail',
        deal_value_range: '500000-1000000',
        proposal_approach: 'digital_transformation',
        reasoning_brief: '小売向けDX',
      },
    ];

    const mockCachedRecommendations = [
      {
        deal_id: 'DEAL-2023-001',
        pattern_id: 'PAT-001',
        customer_name: 'ABC Manufacturing',
        recommendation_date: '2024-01-10T09:00:00Z',
      },
      {
        deal_id: 'DEAL-2023-002',
        pattern_id: 'PAT-001',
        customer_name: 'XYZ Manufacturing',
        recommendation_date: '2024-01-09T14:30:00Z',
      },
    ];

    let callCount = 0;
    mockAiEngine.generateRecommendation.mockImplementation(async () => {
      callCount += 1;
      const error = new Error('Network timeout');
      (error as any).code = 'ECONNABORTED';
      throw error;
    });

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input = {
      customer_id: 'CUST-001',
      customer_industry: 'manufacturing',
      customer_scale: 'large',
      deal_value: 2500000,
      deal_stage: 'proposal',
      customer_pain_points: ['cost_reduction', 'efficiency'],
      required_solutions: ['automation', 'analytics'],
      deal_timeline_days: 60,
    };

    const result = await generateRecommendationWithFallback(
      input,
      mockAiEngine,
      mockPatternMaster,
      mockCachedRecommendations,
      mockFileStorage
    );

    expect(callCount).toBe(3);
    expect(result.source).toBe('fallback_pattern_master');
    expect(result.recommendation_pattern_id).toBe('PAT-001');
    expect(result.recommendation_pattern.success_rate).toBe(0.92);
    expect(result.recommendation_pattern.proposal_approach).toBe('solution_oriented');
    expect(result.reasoning_brief).toBe('製造業向け大型案件');
    expect(result.reasoning_brief.length).toBeLessThan(50);
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.cached_similar_deals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deal_id: 'DEAL-2023-001',
          pattern_id: 'PAT-001',
          customer_name: 'ABC Manufacturing',
        }),
        expect.objectContaining({
          deal_id: 'DEAL-2023-002',
          pattern_id: 'PAT-001',
          customer_name: 'XYZ Manufacturing',
        }),
      ])
    );
    expect(result.cached_similar_deals.length).toBe(2);
  });
});