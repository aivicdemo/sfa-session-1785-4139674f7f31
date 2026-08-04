import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去商談データから成功パターンを抽出し新規案件の提案アプローチを自動推奨', () => {
  // SCEN-106
  test('OpenAI APIの全再試行が失敗した場合に利用者向けメッセージが表示される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout')),
    };

    const mockRecommendationRepository = {
      findTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'pat-001',
          industry: '製造業',
          budget_range: '500万円',
          approach: 'Cost削減重視の提案',
          success_rate: 0.85,
          pattern_description: '製造業向け効率化ソリューション',
        },
        {
          pattern_id: 'pat-002',
          industry: '製造業',
          budget_range: '500万円',
          approach: 'リスク低減重視の提案',
          success_rate: 0.78,
          pattern_description: '製造業向けリスク管理ソリューション',
        },
      ]),
    };

    const input = {
      industry: '製造業',
      budget_amount: 5000000,
      customer_size: '大企業',
      business_challenge: '生産効率化',
    };

    const result = await generateRecommendation(input, mockAIEngine, mockRecommendationRepository);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result.status_code).toBe(200);
    expect(result.message).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(result.recommendation_content).toBeDefined();
    expect(result.recommendation_content.approach).toBe('Cost削減重視の提案');
    expect(result.recommendation_content.success_rate).toBe(0.85);
    expect(result.recommendation_content.pattern_description).toBe('製造業向け効率化ソリューション');
    expect(result.reasoning_summary).toBe('過去事例に基づく統計的推奨');
    expect(result.from_cache).toBe(true);
  });
});