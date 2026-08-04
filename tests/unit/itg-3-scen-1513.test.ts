import { evaluateHistoricalDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation with Consecutive Identical Values', () => {
  test('SCEN-1513: consecutive identical purchase records do not negatively impact quality assessment', () => {
    // Arrange: Prepare test dataset with 5 consecutive purchase records having identical product ID and amount
    const purchaseHistoryData = [
      {
        product_id: 'PROD-001',
        purchase_amount: 50000,
        purchase_date: '2024-01-15',
        quantity: 10
      },
      {
        product_id: 'PROD-001',
        purchase_amount: 50000,
        purchase_date: '2024-01-16',
        quantity: 10
      },
      {
        product_id: 'PROD-001',
        purchase_amount: 50000,
        purchase_date: '2024-01-17',
        quantity: 10
      },
      {
        product_id: 'PROD-001',
        purchase_amount: 50000,
        purchase_date: '2024-01-18',
        quantity: 10
      },
      {
        product_id: 'PROD-001',
        purchase_amount: 50000,
        purchase_date: '2024-01-19',
        quantity: 10
      },
      {
        product_id: 'PROD-002',
        purchase_amount: 75000,
        purchase_date: '2024-02-01',
        quantity: 15
      }
    ];

    // Create stub for AIRecommendationEngine.findSimilarPatterns
    const mockFindSimilarPatterns = jest.fn().mockReturnValue({
      matched_patterns: [
        {
          pattern_id: 'PAT-001',
          similarity_score: 0.82,
          source_deal_id: 'DEAL-2023-0150'
        }
      ],
      excluded_patterns: []
    });

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: Execute data quality evaluation
    const result = evaluateHistoricalDataQuality(
      purchaseHistoryData,
      mockAIRecommendationEngine
    );

    // Assert: Verify quality score is in normal range (75 or above) and duplicate values are not treated as anomalies
    expect(result.quality_score).toBeGreaterThanOrEqual(75);
    expect(result.quality_status).toBe('正常');
    expect(result.duplicate_detection_message).toBe('同一値の重複検出：許容範囲内');

    // Verify that consecutive identical records are not excluded from recommendation input
    expect(result.records_processed).toBe(6);
    expect(result.records_excluded).toBe(0);

    // Verify statistical calculations are computed despite identical values
    expect(result.statistics).toBeDefined();
    expect(result.statistics.average_purchase_amount).toBe(58333.33);
    expect(result.statistics.variance).toBeDefined();
    expect(result.statistics.variance).toBeGreaterThan(0);

    // Verify that AIRecommendationEngine is called with all records
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        product_ids: ['PROD-001', 'PROD-002'],
        purchase_amounts: [50000, 75000],
        record_count: 6
      })
    );

    // Verify duplicate values are NOT in excluded patterns
    expect(result.exclusion_reason).toBeUndefined();
    expect(result.outlier_detection_result).toBeDefined();
    expect(result.outlier_detection_result.outliers_found).toBe(0);
  });
});