import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('商談条件マッチング機能 - 部分マッチスコア計算', () => {
  test('SCEN-184: 予算と関与部署の2項目でマッチ、期間欠落時は部分マッチスコアを返す', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((dealConditions: any, newDealData: any) => {
        const matchedConditions: string[] = [];
        const missingConditions: string[] = [];

        if (newDealData.budget !== undefined && newDealData.budget === dealConditions.budget) {
          matchedConditions.push('予算');
        }

        if (newDealData.period === undefined || newDealData.period === null) {
          missingConditions.push('期間');
        } else if (newDealData.period === dealConditions.period) {
          matchedConditions.push('期間');
        }

        if (newDealData.department !== undefined && newDealData.department === dealConditions.department) {
          matchedConditions.push('関与部署');
        }

        const evaluableConditionCount = dealConditions.budget !== undefined ? 1 : 0;
        const evaluableConditionCount2 = dealConditions.period !== undefined ? 1 : 0;
        const evaluableConditionCount3 = dealConditions.department !== undefined ? 1 : 0;
        const totalEvaluableConditions = evaluableConditionCount + evaluableConditionCount2 + evaluableConditionCount3;

        const matchScore = totalEvaluableConditions > 0 ? matchedConditions.length / totalEvaluableConditions : 0;

        return {
          score: matchScore,
          matchedConditions: matchedConditions,
          missingConditions: missingConditions,
          scoreSummary: `利用条件: ${matchedConditions.join('、')}（${matchedConditions.length}項目）/ 欠落項目: ${missingConditions.join('、')}（${missingConditions.length}項目）`,
          evaluationDetails: {
            totalConditions: totalEvaluableConditions,
            matchedCount: matchedConditions.length,
            missingCount: missingConditions.length,
          },
        };
      }),
    };

    const successPatternData = {
      budget: 5000000,
      period: 90,
      department: '営業部',
    };

    const newDealData = {
      budget: 5000000,
      period: null,
      department: '営業部',
    };

    const result = mockAIEngine.evaluatePatternRelevance(successPatternData, newDealData);

    expect(result.score).toBeGreaterThanOrEqual(0.67);
    expect(result.score).toBeLessThanOrEqual(0.75);

    expect(result.scoreSummary).toContain('利用条件: 予算、関与部署（2項目）');
    expect(result.scoreSummary).toContain('欠落項目: 期間（1項目）');

    expect(result.matchedConditions).toEqual(['予算', '関与部署']);
    expect(result.missingConditions).toEqual(['期間']);

    expect(result.evaluationDetails.totalConditions).toBe(3);
    expect(result.evaluationDetails.matchedCount).toBe(2);
    expect(result.evaluationDetails.missingCount).toBe(1);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(successPatternData, newDealData);
  });
});