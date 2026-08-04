import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能', () => {
  // SCEN-673
  test('顧客条件が0件のとき、一般的な成功パターンを返す', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(null),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const caseData = {
      customerId: 'TEST-001',
      conditions: [],
      customerName: 'Sample Corp',
      industry: 'IT',
      companySize: 'medium',
    };

    const result = await generateRecommendation(caseData, mockAIEngine);

    expect(result).toBeDefined();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeGreaterThan(0);

    const topPatterns = result.patterns.slice(0, 3);
    topPatterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('proposalApproach');
      expect(typeof pattern.proposalApproach).toBe('string');
      expect(pattern.proposalApproach.length).toBeGreaterThan(0);

      expect(pattern).toHaveProperty('applicabilityScore');
      expect(typeof pattern.applicabilityScore).toBe('number');
      expect(pattern.applicabilityScore).toBeGreaterThanOrEqual(0);
      expect(pattern.applicabilityScore).toBeLessThanOrEqual(100);

      expect(pattern).toHaveProperty('reasoningExplanation');
      expect(typeof pattern.reasoningExplanation).toBe('string');
      expect(pattern.reasoningExplanation.length).toBeGreaterThan(0);
      expect(pattern.reasoningExplanation.length).toBeLessThan(200);
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(caseData);
  });
});