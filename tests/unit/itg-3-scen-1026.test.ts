import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1026
  test('OpenAI API失敗時、キャッシュされた過去推奨履歴が画面に表示される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.generateRecommendation.mockImplementation(async () => {
      callCount++;
      const error = new Error('API Timeout');
      (error as any).code = 'TIMEOUT_EXCEEDED';
      throw error;
    });

    const cachedRecommendations = [
      {
        id: 'pattern_001',
        approach: '段階的導入提案',
        reason: '同業種過去成功率82%',
        confidenceScore: 82,
      },
      {
        id: 'pattern_002',
        approach: 'ROI分析説明',
        reason: '予算帯での成約実績',
        confidenceScore: 78,
      },
      {
        id: 'pattern_003',
        approach: 'リスク低減策の提示',
        reason: '導入後の運用支援実績',
        confidenceScore: 75,
      },
    ];

    const executionLog: string[] = [];

    const input = {
      customerId: 'cust_001',
      industry: '製造業',
      budget: 5000000,
      challenge: '生産効率化',
      dealId: 'deal_001',
    };

    const result = await generateRecommendationWithFallback(input, mockAIEngine, cachedRecommendations, executionLog);

    expect(callCount).toBe(3);
    expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0].approach).toBe('段階的導入提案');
    expect(result.recommendations[0].reason).toBe('同業種過去成功率82%');
    expect(result.recommendations[0].confidenceScore).toBe(82);
    expect(result.recommendations[1].approach).toBe('ROI分析説明');
    expect(result.recommendations[1].reason).toBe('予算帯での成約実績');
    expect(result.recommendations[1].confidenceScore).toBe(78);
    expect(result.recommendations[2].approach).toBe('リスク低減策の提示');
    expect(result.recommendations[2].reason).toBe('導入後の運用支援実績');
    expect(result.recommendations[2].confidenceScore).toBe(75);
    expect(result.simplifiedReasoning).toBeDefined();
    expect(result.simplifiedReasoning).not.toBe('');
    expect(executionLog).toContainEqual(expect.stringMatching(/retry.*1.*1000ms/));
    expect(executionLog).toContainEqual(expect.stringMatching(/retry.*2.*2000ms/));
    expect(executionLog).toContainEqual(expect.stringMatching(/retry.*3.*4000ms/));
    expect(executionLog).toContainEqual(expect.stringMatching(/fallback.*cache/i));
  });
});