import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 外部サービス呼び出し再試行', () => {
  test('SCEN-2702: 2回目失敗後に2秒待機して3回目の再試行が実行される', async () => {
    jest.useFakeTimers();

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const callTimestamps: number[] = [];
    const errors: Error[] = [];

    mockAIEngine.generateRecommendation
      .mockImplementationOnce(async () => {
        callTimestamps.push(Date.now());
        return {
          approach: '初回提案アプローチ',
          confidence: 85,
          reasoning: '過去成功パターンに基づく',
        };
      })
      .mockImplementationOnce(async () => {
        callTimestamps.push(Date.now());
        const err = new Error('Network error');
        errors.push(err);
        throw err;
      })
      .mockImplementationOnce(async () => {
        callTimestamps.push(Date.now());
        return {
          approach: '再試行成功アプローチ',
          confidence: 78,
          reasoning: '第3回呼び出しで正常応答',
        };
      });

    const inputCondition = {
      customerId: 'CUST-001',
      industryType: '製造業',
      companyScale: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = await generateRecommendation(inputCondition, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(callTimestamps.length).toBe(3);

    const timeBetween1st2nd = callTimestamps[1] - callTimestamps[0];
    expect(timeBetween1st2nd).toBeLessThan(100);

    jest.advanceTimersByTime(1000);

    const timeBetween2nd3rd = callTimestamps[2] - callTimestamps[1];
    expect(timeBetween2nd3rd).toBeGreaterThanOrEqual(2000);
    expect(timeBetween2nd3rd).toBeLessThan(2100);

    jest.useRealTimers();

    expect(result).toEqual({
      approach: expect.any(String),
      confidence: expect.any(Number),
      reasoning: expect.any(String),
    });

    expect(errors.length).toBe(1);
    expect(errors[0].message).toMatch(/Network error/);
  });
});