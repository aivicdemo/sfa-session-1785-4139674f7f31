import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2792
  test('AIRecommendationEngineの呼び出しがタイムアウト（30秒超過）した場合、TimeoutErrorを返す', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(async () => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timeout after 30000ms'));
          }, 31000);
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectData = {
      customerId: 'CUST-00001',
      customerName: 'Test Corporation',
      industry: 'Manufacturing',
      employeeCount: 500,
      dealAmount: 5000000,
      dealStage: 'Discovery',
      dealDate: new Date('2024-06-15T10:00:00Z'),
      dealConditions: {
        budget: 5000000,
        timeline: 'Q3 2024',
        decisionMaker: 'CTO',
        painPoints: ['Operational efficiency', 'Cost reduction'],
      },
    };

    try {
      await generateRecommendation(newProjectData, mockAIEngine);
      fail('Should have thrown TimeoutError');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error).toMatchObject({
          name: expect.stringMatching(/TimeoutError|RequestTimeout/),
          message: expect.stringMatching(/timeout|タイムアウト/i),
        });
      }
    }

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newProjectData
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});