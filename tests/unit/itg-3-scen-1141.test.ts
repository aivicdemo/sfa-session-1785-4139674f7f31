import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ生成機能 - API再試行制御', () => {
  // SCEN-1141
  test('AIエージェント呼び出しが最初のAPI呼び出しで失敗したとき、1秒後に1回目の再試行を実行する', async () => {
    jest.useFakeTimers();

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.generateRecommendation.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('API call failed'));
      }
      return Promise.resolve({
        recommendation: '提案アプローチA',
        reasoning: '根拠X',
      });
    });

    const inputCustomerData = {
      customerId: 'CUST-001',
      industry: '製造業',
      scale: '1000-5000',
      dealStage: '初期接触',
    };

    const resultPromise = generateRecommendation(inputCustomerData, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(600);
    await Promise.resolve();
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);

    jest.runAllTimers();
    const result = await resultPromise;

    expect(result).toEqual({
      recommendation: '提案アプローチA',
      reasoning: '根拠X',
    });

    jest.useRealTimers();
  });
});