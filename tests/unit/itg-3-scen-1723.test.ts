import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1723
  test('浮動小数点の端数が出るスコア値を小数第1位で丸める', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(78.456789),
    };

    const rawScore = mockAIRecommendationEngine.evaluatePatternRelevance({
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealConditions: {
        productCategory: 'enterprise_software',
        dealAmount: 5000000,
        proposalApproach: 'multi_stakeholder_engagement',
      },
      successPattern: {
        industryMatch: 0.9,
        sizeMatch: 0.85,
        approachMatch: 0.88,
      },
    });

    const roundedScore = evaluatePatternRelevance(rawScore);

    expect(roundedScore).toBe(78.5);
  });
});