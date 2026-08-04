import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-840
  test('[error] 推奨内容の信頼度スコア算出・根拠提示機能 - AIRecommendationEngine.generateRecommendation が最大再試行回数を超えて失敗したとき、エラーで処理が進まない', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API_FAILURE'))
        .mockRejectedValueOnce(new Error('API_FAILURE'))
        .mockRejectedValueOnce(new Error('API_FAILURE')),
    };

    const mockTimers = {
      delays: [] as number[],
    };

    const originalSetTimeout = global.setTimeout;
    global.setTimeout = jest.fn((callback: any, delay: number) => {
      mockTimers.delays.push(delay);
      callback();
      return 0 as any;
    });

    const newProjectData = {
      customerId: 'CUST-001',
      customerName: '新規顧客A',
      industry: '製造業',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'initial_contact',
      dealConditions: {
        budgetLimit: 10000000,
        decisionDeadline: '2024-12-31',
        requiredCapabilities: ['automation', 'analytics'],
      },
    };

    let thrownError: any;

    try {
      await generateRecommendation(newProjectData, mockAIEngine);
    } catch (error) {
      thrownError = error;
    }

    global.setTimeout = originalSetTimeout;

    expect(thrownError).toBeDefined();
    expect(thrownError.code).toBe('RECOMMENDATION_GENERATION_FAILED');
    expect(thrownError.message).toMatch(/再試行/);
    expect(thrownError.retryCount).toBe(3);
    expect(thrownError.timeout).toBe(30000);
    expect(mockTimers.delays).toEqual([1000, 2000, 4000]);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});