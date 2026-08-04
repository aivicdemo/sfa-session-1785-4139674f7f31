import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1951
  test('過去商談データから抽出された成功パターンが1件のときに該当パターンが適用される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'SP-001',
          applicabilityScore: 0.95,
          conditions: {
            industry: '製造業',
            scale: '大規模',
            budgetThreshold: 50000000,
            implementationMonths: 3
          },
          approachDescription: '大規模製造業向けの提案手法を適用'
        }
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'SP-001',
        relevanceScore: 0.95,
        isApplicable: true
      })
    };

    const newDealInput = {
      customerName: 'A製造所',
      industry: '製造業',
      estimatedBudget: 60000000,
      implementationPeriodMonths: 3
    };

    return generateRecommendation(newDealInput, mockAIEngine).then(
      (recommendationResult) => {
        expect(recommendationResult.appliedPatterns).toHaveLength(1);
        expect(recommendationResult.appliedPatterns[0].patternId).toBe(
          'SP-001'
        );
        expect(
          recommendationResult.appliedPatterns[0].approachDescription
        ).toMatch(/大規模製造業向けの提案手法を適用/);
        expect(recommendationResult.appliedPatterns[0].relevanceScore).toBe(
          0.95
        );
        expect(recommendationResult.appliedPatterns[0].isApplicable).toBe(
          true
        );
        expect(recommendationResult.alternativePatterns).toHaveLength(0);
      }
    );
  });
});