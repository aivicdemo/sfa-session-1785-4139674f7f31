import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ生成機能 - 再試行ロジック', () => {
  // SCEN-1142
  test('AIエージェント呼び出しが1回目の再試行で失敗したとき、2秒後に2回目の再試行を実行する', async () => {
    const callTimestamps: number[] = [];
    let callCount = 0;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => {
        const currentTime = Date.now();
        callTimestamps.push(currentTime);
        callCount++;

        if (callCount === 1) {
          throw new Error('Timeout: Request exceeded 30 seconds');
        }
        if (callCount === 2) {
          throw new Error('429 Rate Limit Exceeded');
        }
        if (callCount === 3) {
          return {
            approachId: 'APPROACH-001',
            recommendedApproach: 'Initial meeting with emphasis on cost reduction and efficiency improvement',
            rationale: 'Similar customer patterns show 85% success rate with this approach',
            confidenceScore: 92,
            baselinePatterns: [
              {
                patternId: 'PAT-2024-001',
                matchScore: 0.92,
                successRate: 0.85,
                customerAttributes: {
                  industry: 'Manufacturing',
                  employeeCount: 500,
                  annualRevenue: 50000000,
                },
                approachSummary: 'Focus on operational efficiency and ROI demonstration',
              },
            ],
          };
        }
        throw new Error('Unexpected call');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerData = {
      customerId: 'CUST-2024-0042',
      customerName: 'TechVentures Inc.',
      industry: 'Manufacturing',
      employeeCount: 500,
      annualRevenue: 50000000,
      currentChallenges: ['Operational inefficiency', 'Cost overruns'],
    };

    const dealData = {
      dealId: 'DEAL-2024-0156',
      dealStage: 'Initial Contact',
      productCategory: 'ERP Solution',
      estimatedValue: 500000,
      decisionTimeline: '3 months',
    };

    const startTime = Date.now();
    const result = await generateRecommendation(
      customerData,
      dealData,
      mockAIRecommendationEngine
    );

    const endTime = Date.now();
    const totalElapsedTime = endTime - startTime;

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(result).toEqual({
      approachId: 'APPROACH-001',
      recommendedApproach: 'Initial meeting with emphasis on cost reduction and efficiency improvement',
      rationale: 'Similar customer patterns show 85% success rate with this approach',
      confidenceScore: 92,
      baselinePatterns: [
        {
          patternId: 'PAT-2024-001',
          matchScore: 0.92,
          successRate: 0.85,
          customerAttributes: {
            industry: 'Manufacturing',
            employeeCount: 500,
            annualRevenue: 50000000,
          },
          approachSummary: 'Focus on operational efficiency and ROI demonstration',
        },
      ],
    });

    const firstToSecondInterval = callTimestamps[1] - callTimestamps[0];
    const secondToThirdInterval = callTimestamps[2] - callTimestamps[1];

    expect(firstToSecondInterval).toBeGreaterThanOrEqual(1900);
    expect(firstToSecondInterval).toBeLessThanOrEqual(2100);

    expect(secondToThirdInterval).toBeGreaterThanOrEqual(3900);
    expect(secondToThirdInterval).toBeLessThanOrEqual(4100);

    expect(totalElapsedTime).toBeGreaterThanOrEqual(5900);
    expect(totalElapsedTime).toBeLessThanOrEqual(6500);
  });
});