import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン適用可能性評価', () => {
  // SCEN-2911
  test('OpenAI API連携 - evaluatePatternRelevance呼び出しが正常応答を受けた場合、適用可能性のスコアが返却される', async () => {
    const mockOpenAIResponse = {
      relevanceScore: 0.85,
      confidenceLevel: 0.92,
      applicabilityFactors: {
        industryMatch: 0.90,
        budgetAlignment: 0.80,
        purchaseStageMatch: 0.85
      }
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(mockOpenAIResponse)
    };

    const newCaseData = {
      customerIndustry: '製造業',
      budgetRange: {
        min: 5000000,
        max: 10000000
      },
      currentPurchaseStage: 'evaluation',
      companySize: 'large',
      decisionMakerCount: 5
    };

    const successPatternData = {
      patternId: 'pattern_001',
      industry: '製造業',
      typicalBudgetRange: {
        min: 4000000,
        max: 12000000
      },
      targetPurchaseStage: 'evaluation',
      successRate: 0.78,
      casesApplied: 23
    };

    const result = await evaluatePatternRelevance(
      newCaseData,
      successPatternData,
      mockAIRecommendationEngine
    );

    expect(result).toBe(0.85);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newCaseData,
      successPatternData
    );
  });
});