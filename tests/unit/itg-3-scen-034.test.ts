import { validateTrainingDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 学習データ品質検証', () => {
  // SCEN-034
  test('[normal] 学習データ品質スコアが未設定の場合に検証が正常に実行される', async () => {
    const trainingDataset = Array.from({ length: 100 }, (_, i) => ({
      dealId: `DEAL_${String(i + 1).padStart(3, '0')}`,
      customerInfo: {
        name: `Customer ${i + 1}`,
        industry: 'Technology',
        revenue: 1000000 + i * 10000,
      },
      proposalContent: {
        approach: `Approach ${i + 1}`,
        value: 50000 + i * 1000,
      },
      contractedFlg: i % 2 === 0,
      qualityScore: undefined as unknown as number | null,
    }));

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0.75,
        patterns: [
          {
            id: 'P001',
            relevance: 0.82,
          },
        ],
      }),
    };

    const result = await validateTrainingDataQuality(
      trainingDataset,
      mockAIRecommendationEngine
    );

    expect(result.isValid).toBe(true);
    expect(result.validationSummary).toContain(
      'Learning data quality scores were not set; validation proceeded using pattern evaluation fallback'
    );
    expect(result.processedRecordCount).toBe(100);
    expect(result.missingQualityScoreCount).toBe(100);
    expect(result.patternsEvaluated).toBe(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});