import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能 - OpenAI API失敗時の代替推奨', () => {
  // SCEN-1335
  test('OpenAI APIが失敗したとき、キャッシュされた過去推奨から代替推奨が返される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout'))
        .mockRejectedValueOnce(new Error('API Timeout')),
    };

    const mockPatternMaster = [
      {
        pattern_id: 'pat_001',
        customer_industry: 'IT',
        deal_value_range: '1000000-5000000',
        success_rate: 0.85,
        approach: '段階的導入提案',
        brief_explanation: 'IT企業向けの段階的導入が実績あり',
        rank: 1,
      },
      {
        pattern_id: 'pat_002',
        customer_industry: 'IT',
        deal_value_range: '1000000-5000000',
        success_rate: 0.72,
        approach: '一括導入提案',
        brief_explanation: '一括導入による短期効果実証',
        rank: 2,
      },
    ];

    const newDealData = {
      customer_id: 'cust_12345',
      customer_name: '株式会社テックベンチャー',
      industry: 'IT',
      company_size: '101-500',
      estimated_deal_value: 2500000,
      current_challenges: ['システム老朽化', '運用効率化'],
      budget_status: '予算承認済み',
      decision_timeline_days: 30,
    };

    const startTime = Date.now();
    const result = await generateRecommendation(newDealData, mockAIEngine, mockPatternMaster);
    const elapsedMs = Date.now() - startTime;

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendation: {
        pattern_id: 'pat_001',
        approach: '段階的導入提案',
        brief_explanation: 'IT企業向けの段階的導入が実績あり',
        confidence_score: 85,
        source: 'pattern_master_cache',
      },
      retry_attempts: 3,
    });

    expect(elapsedMs).toBeGreaterThanOrEqual(7000);
    expect(elapsedMs).toBeLessThanOrEqual(9000);
  });
});