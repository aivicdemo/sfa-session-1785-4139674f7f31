import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けルール生成機能', () => {
  // SCEN-2760
  test('過去商談データが1件の場合、その1件のパターンから重み付けが計算される', async () => {
    const pastDealId = 'DEAL-20240101-001';
    const pastDealData = {
      dealId: pastDealId,
      customerIndustry: '製造業',
      dealSize: 5000000,
      proposalContent: '生産効率化ソリューション',
      result: '成約',
      contractStatus: '契約完了',
    };

    const newDealCondition = {
      customerIndustry: '製造業',
      dealSize: 4800000,
      proposalContent: '生産効率化',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        embeddingScore: 0.95,
        patternId: pastDealId,
        basePatternData: pastDealData,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toBeDefined();
    expect(result.weightRule).toBeDefined();
    expect(result.weightRule.patternId).toBe(pastDealId);
    expect(result.weightRule.weight).toBe(1.0);
    expect(result.weightRule.baseSampleCount).toBe(1);
    expect(result.weightRule.extractionTimestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: '製造業',
        dealSize: 4800000,
        proposalContent: '生産効率化',
      })
    );
  });
});