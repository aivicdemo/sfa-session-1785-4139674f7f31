import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2046
  test('成功パターン抽出と新規案件への提案アプローチ推奨機能 - 過去商談データから抽出した成功パターンが0件のとき、デフォルト推奨パターンが適用される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerProfile: {
        companySize: 'mid_enterprise',
        industry: 'manufacturing',
        budget: 5000000,
        decisionMakersCount: 3,
      },
      dealConditions: {
        dealStage: 'initial_proposal',
        productCategory: 'system_solution',
        timelineDays: 90,
      },
    };

    const startTime = Date.now();
    const result = await generateRecommendation(newDealData, mockAIEngine);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        companySize: 'mid_enterprise',
        industry: 'manufacturing',
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        recommendationId: expect.any(String),
        patternName: expect.any(String),
        proposalApproach: expect.any(String),
        reasoningExplanation: expect.any(String),
        applicabilityScore: expect.any(Number),
      })
    );

    expect(result.patternName).toBe('段階的提案型アプローチ');

    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(1.0);

    expect(result.reasoningExplanation.length).toBeLessThanOrEqual(250);

    expect(responseTime).toBeLessThan(3000);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});