import { retryGenerateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨生成のリトライ処理', () => {
  // SCEN-1022
  test('1回目失敗(Timeout)→2回目失敗(500)→3回目成功時、指数バックオフで再試行される', async () => {
    const mockRecommendation = {
      proposalApproach: 'テスト提案アプローチ',
      confidence: 85,
      reasoning: '過去事例との一致度が高い',
    };

    let callCount = 0;
    const callTimestamps: number[] = [];

    const mockAIEngine = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        callTimestamps.push(Date.now());

        if (callCount === 1) {
          throw new Error('TimeoutError');
        }
        if (callCount === 2) {
          throw new Error('APIError 500');
        }
        return mockRecommendation;
      }),
    };

    const customerData = {
      industry: 'IT',
      scale: 'large',
      challenges: ['デジタル化'],
    };

    const dealConditions = {
      productCategory: 'クラウドサービス',
      budget: 5000000,
      timeline: '3ヶ月以内',
    };

    const startTime = Date.now();
    const result = await retryGenerateRecommendation(
      mockAIEngine,
      customerData,
      dealConditions
    );

    expect(callCount).toBe(3);
    expect(result).toEqual(mockRecommendation);

    const firstFailureToSecondCall = callTimestamps[1] - callTimestamps[0];
    expect(firstFailureToSecondCall).toBeGreaterThanOrEqual(1800);
    expect(firstFailureToSecondCall).toBeLessThanOrEqual(2200);

    const secondFailureToThirdCall = callTimestamps[2] - callTimestamps[1];
    expect(secondFailureToThirdCall).toBeGreaterThanOrEqual(3800);
    expect(secondFailureToThirdCall).toBeLessThanOrEqual(4200);
  });
});