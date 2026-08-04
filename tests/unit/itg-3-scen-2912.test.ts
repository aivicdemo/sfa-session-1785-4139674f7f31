import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを推奨する', () => {
  // SCEN-2912
  test('OpenAI API連携 - generateRecommendation呼び出しが失敗した場合、キャッシュされた過去推奨が代替表示される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = {
      getTopPatternByDealType: jest.fn().mockResolvedValue({
        pattern_id: 'PAT-001',
        approach_name: '提案アプローチ_A',
        success_rate: 0.78,
        applicable_segment: 'mid_market',
        brief_reasoning: '中堅企業向けの段階的提案が効果的',
      }),
    };

    const newDealCondition = {
      deal_id: 'DEAL-NEW-001',
      customer_industry: 'IT',
      customer_size: 'mid_market',
      deal_stage: 'initial_contact',
      customer_challenges: ['digital_transformation', 'cost_optimization'],
      budget_range: '5000000-10000000',
      decision_timeline_days: 90,
    };

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelays = [1000, 2000, 4000];

    mockAIEngine.generateRecommendation.mockImplementation(async () => {
      retryCount++;
      if (retryCount <= maxRetries) {
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), retryDelays[retryCount - 1])
        );
      }
      throw new Error('All retries exhausted');
    });

    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine,
      mockPatternMaster
    );

    expect(retryCount).toBe(maxRetries);
    expect(result.status).toBe('fallback');
    expect(result.recommendation).toEqual({
      pattern_id: 'PAT-001',
      approach_name: '提案アプローチ_A',
      success_rate: 0.78,
      brief_reasoning: '中堅企業向けの段階的提案が効果的',
    });
    expect(result.fallback_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.is_cached).toBe(true);
  });
});