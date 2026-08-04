import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨生成 - リトライ処理', () => {
  // SCEN-1023
  test('3回目呼び出し失敗時に4秒後に再試行され、4回目で成功レスポンスが返される', async () => {
    const mockAIEngine = {
      callCount: 0,
      timestamps: [] as number[],
      async invoke(input: any): Promise<any> {
        this.callCount++;
        this.timestamps.push(Date.now());

        if (this.callCount === 1) {
          return {
            recommendation: 'approach_1',
            confidence: 85,
            reasoning: 'Based on similar customer segment',
          };
        }

        if (this.callCount === 2) {
          return {
            recommendation: 'approach_1',
            confidence: 85,
            reasoning: 'Based on similar customer segment',
          };
        }

        if (this.callCount === 3) {
          const error = new Error('API timeout');
          (error as any).code = 'ETIMEDOUT';
          throw error;
        }

        if (this.callCount === 4) {
          return {
            recommendation: 'approach_1',
            confidence: 85,
            reasoning: 'Based on similar customer segment',
          };
        }

        throw new Error('Unexpected call');
      },
    };

    const input = {
      customerId: 'CUST-001',
      industry: 'Manufacturing',
      companySize: 'Large',
      currentChallenge: 'Supply chain optimization',
      budget: 500000,
      timeline: 'Q2 2026',
    };

    const result = await generateRecommendation(input, mockAIEngine);

    expect(mockAIEngine.callCount).toBe(4);
    expect(result.recommendation).toBe('approach_1');
    expect(result.confidence).toBe(85);
    expect(result.reasoning).toBe('Based on similar customer segment');

    const interval_3_to_4 =
      mockAIEngine.timestamps[3] - mockAIEngine.timestamps[2];
    expect(interval_3_to_4).toBeGreaterThanOrEqual(4000);
    expect(interval_3_to_4).toBeLessThan(4500);
  });
});