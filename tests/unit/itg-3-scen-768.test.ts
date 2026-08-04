import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-768
  test('AIRecommendationEngine.generateRecommendation が 2 回目の呼び出しで失敗したとき、2 秒後に再試行される', async () => {
    jest.useFakeTimers();

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };

    let callCount = 0;
    mockRecommendationEngine.generateRecommendation.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          recommendationId: 'rec-001',
          proposalApproach: '初回提案アプローチ',
          confidenceScore: 85,
          reasoning: '過去成功パターンに基づく推奨',
        });
      }
      if (callCount === 2) {
        return Promise.reject(new Error('API call failed'));
      }
      if (callCount === 3) {
        return Promise.resolve({
          recommendationId: 'rec-002',
          proposalApproach: '再試行による提案アプローチ',
          confidenceScore: 82,
          reasoning: '再試行時の推奨内容',
        });
      }
      return Promise.reject(new Error('Unexpected call'));
    });

    const inputData = {
      customerId: 'cust-123',
      industry: 'IT',
      companySize: 'large',
      dealValue: 5000000,
      dealStage: 'proposal',
    };

    const firstResult = await generateRecommendation(inputData, mockRecommendationEngine);
    expect(firstResult.confidenceScore).toBe(85);
    expect(firstResult.recommendationId).toBe('rec-001');
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    const secondCallPromise = generateRecommendation(inputData, mockRecommendationEngine);
    await expect(secondCallPromise).rejects.toThrow(/API call failed/);
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(2000);

    const retryResult = await generateRecommendation(inputData, mockRecommendationEngine);
    expect(retryResult.confidenceScore).toBe(82);
    expect(retryResult.recommendationId).toBe('rec-002');
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });
});