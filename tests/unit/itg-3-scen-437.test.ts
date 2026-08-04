import { aggregateDataQualityReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート集計', () => {
  test('SCEN-437: [normal] データ品質レポート集計機能 - 同じ入力で2回実行した場合、同じ集計結果が返される', () => {
    // テスト入力データの定義
    const testInputData = {
      customerId: 'CUST-2024-001',
      dealConditions: {
        industry: 'manufacturing',
        companySize: 'large',
        budgetRange: { min: 10000000, max: 50000000 },
        purchaseFrequency: 'quarterly',
      },
      periodRange: {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
      },
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patternId: 'PATTERN-001',
        recommendationScore: 0.87,
        applicability: 0.92,
        category: 'cross_sell',
        reasoning: 'Customer purchase history indicates strong alignment with product line expansion',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-001',
          similarity: 0.95,
          frequency: 45,
        },
        {
          patternId: 'PATTERN-002',
          similarity: 0.78,
          frequency: 23,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'Based on quarterly purchase cycles and large budget allocation patterns'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.88,
        confidence: 0.91,
      }),
    };

    // FileStorageAdapterのスタブ設定
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3Key: 'reports/2024-Q1/CUST-2024-001-report.pdf',
        uploadedAt: '2024-04-01T10:30:00Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: 'https://s3.amazonaws.com/bucket/reports/2024-Q1/CUST-2024-001-report.pdf?expires=...',
        expiresIn: 3600,
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 3,
      }),
    };

    // 1回目の実行
    const firstExecutionResult = aggregateDataQualityReport(
      testInputData,
      mockAIEngine,
      mockFileStorage
    );

    // 集計結果を検証可能な形で保存
    expect(firstExecutionResult).toBeDefined();
    expect(firstExecutionResult.patternId).toBe('PATTERN-001');
    expect(firstExecutionResult.matchScore).toBe(0.87);
    expect(firstExecutionResult.applicability).toBe(0.92);
    expect(firstExecutionResult.category).toBe('cross_sell');
    expect(firstExecutionResult.totalRecordsAggregated).toBe(68);
    expect(firstExecutionResult.dataQualityScore).toBe(87);
    expect(firstExecutionResult.reasoning).toBe(
      'Based on quarterly purchase cycles and large budget allocation patterns'
    );
    expect(firstExecutionResult.similarPatternsCount).toBe(2);
    expect(firstExecutionResult.relevanceScore).toBe(0.88);
    expect(firstExecutionResult.confidenceLevel).toBe(0.91);

    const firstResult = { ...firstExecutionResult };

    // 2回目の実行
    const secondExecutionResult = aggregateDataQualityReport(
      testInputData,
      mockAIEngine,
      mockFileStorage
    );

    expect(secondExecutionResult).toBeDefined();
    expect(secondExecutionResult.patternId).toBe(firstResult.patternId);
    expect(secondExecutionResult.matchScore).toBe(firstResult.matchScore);
    expect(secondExecutionResult.applicability).toBe(firstResult.applicability);
    expect(secondExecutionResult.category).toBe(firstResult.category);
    expect(secondExecutionResult.totalRecordsAggregated).toBe(firstResult.totalRecordsAggregated);
    expect(secondExecutionResult.dataQualityScore).toBe(firstResult.dataQualityScore);
    expect(secondExecutionResult.reasoning).toBe(firstResult.reasoning);
    expect(secondExecutionResult.similarPatternsCount).toBe(firstResult.similarPatternsCount);
    expect(secondExecutionResult.relevanceScore).toBe(firstResult.relevanceScore);
    expect(secondExecutionResult.confidenceLevel).toBe(firstResult.confidenceLevel);

    // AIエンジンが同じ入力で同じ回数呼ばれていることを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
  });
});