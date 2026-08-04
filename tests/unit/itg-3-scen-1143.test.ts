import { generateProposalApproachWithRetry } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ生成機能 - AIエージェント再試行制御', () => {
  // SCEN-1143
  test('AIエージェント呼び出しが2回目の再試行で失敗したとき、4秒後に3回目の再試行を実行する', async () => {
    const mockEngine = {
      generateRecommendation: jest.fn(),
    };

    const dealConditions = {
      customerId: 'C001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealStage: 'proposal',
      dealValue: 500000,
      dealTimeline: 'q1_2024',
    };

    const successResponse = {
      recommendedApproach: 'value-based-selling',
      proposalContent: 'Enterprise solution package',
      confidenceScore: 85,
      rootCause: 'Similar success pattern matched',
      similarCaseCount: 12,
    };

    const callTimestamps = [];

    mockEngine.generateRecommendation.mockImplementation(() => {
      callTimestamps.push(Date.now());
      const callCount = callTimestamps.length;

      if (callCount === 1) {
        return Promise.reject(new Error('API connection timeout'));
      } else if (callCount === 2) {
        return Promise.reject(new Error('API rate limit exceeded'));
      } else if (callCount === 3) {
        return Promise.resolve(successResponse);
      }
    });

    const startTime = Date.now();
    const result = await generateProposalApproachWithRetry(
      dealConditions,
      mockEngine,
    );
    const endTime = Date.now();

    expect(mockEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    const timeBetweenCall1And2 =
      callTimestamps[1] - callTimestamps[0];
    const timeBetweenCall2And3 =
      callTimestamps[2] - callTimestamps[1];

    expect(timeBetweenCall1And2).toBeGreaterThanOrEqual(900);
    expect(timeBetweenCall1And2).toBeLessThanOrEqual(1100);

    expect(timeBetweenCall2And3).toBeGreaterThanOrEqual(3900);
    expect(timeBetweenCall2And3).toBeLessThanOrEqual(4100);

    expect(result).toEqual({
      recommendedApproach: 'value-based-selling',
      proposalContent: 'Enterprise solution package',
      confidenceScore: 85,
      rootCause: 'Similar success pattern matched',
      similarCaseCount: 12,
    });

    const totalElapsedTime = endTime - startTime;
    expect(totalElapsedTime).toBeLessThan(30000);
  });
});