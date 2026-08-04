import { generateRecommendationWithPatternMatching } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1340
  test('過去商談データが1件のとき、その1件のパターンが新規案件と照合される', async () => {
    // === Setup: Mock AIRecommendationEngine ===
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          productCategory: '生産管理システム',
          contractAmount: 50000000,
          negotiationPeriodMonths: 3,
          successFactor: '技術検証フェーズでの導入支援',
          similarityScore: 0.95,
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '技術検証フェーズでの導入支援を重点化した提案',
        reasoning: 'Past success pattern matched on industry and product category',
        confidenceScore: 85,
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 0.92,
        recommendations: ['Strengthen technical validation phase support'],
      }),
    };

    // === Input: New deal data ===
    const newDealInput = {
      customerIndustry: '製造業',
      productCategory: '生産管理システム',
      estimatedAmount: 45000000,
      customerSize: 'large',
      existingRelationship: false,
    };

    // === Execute ===
    const result = await generateRecommendationWithPatternMatching(
      newDealInput,
      mockAIEngine
    );

    // === Assertions ===
    // 1. Verify that findSimilarPatterns was called with correct input
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);

    // 2. Verify that generateRecommendation was called
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    // 3. Verify that evaluatePatternRelevance was called
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 4. Verify recommended approach matches expected value
    expect(result.recommendedApproach).toBe(
      '技術検証フェーズでの導入支援を重点化した提案'
    );

    // 5. Verify applicability score is exactly 0.92
    expect(result.applicabilityScore).toBe(0.92);

    // 6. Verify similar patterns count is 1
    expect(result.similarPatterns).toHaveLength(1);

    // 7. Verify the single similar pattern has correct industry
    expect(result.similarPatterns[0].customerIndustry).toBe('製造業');

    // 8. Verify the single similar pattern has correct product category
    expect(result.similarPatterns[0].productCategory).toBe('生産管理システム');

    // 9. Verify the single similar pattern has correct success factor
    expect(result.similarPatterns[0].successFactor).toBe(
      '技術検証フェーズでの導入支援'
    );

    // 10. Verify similarity score is 0.95
    expect(result.similarPatterns[0].similarityScore).toBe(0.95);

    // 11. Verify that reasoning explanation is included
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe('string');

    // 12. Verify confidence score is 85
    expect(result.confidenceScore).toBe(85);
  });
});