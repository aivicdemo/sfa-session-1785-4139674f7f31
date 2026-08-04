import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  // SCEN-1492
  test('should evaluate data quality for all purchase history records when multiple records are provided', () => {
    // Arrange: Prepare mock purchase history records with different quality issues
    const purchaseHistoryRecordA = {
      recordId: 'REC-A',
      purchaseDate: '2024-01-15',
      productId: 'PROD-001',
      quantity: 10,
      amount: 50000,
      customerNotes: null, // quality issue: null value
    };

    const purchaseHistoryRecordB = {
      recordId: 'REC-B',
      purchaseDate: '2024-02-20',
      productId: 'PROD-002',
      quantity: '5', // quality issue: data type mismatch (string instead of number)
      amount: 25000,
      customerNotes: 'Follow-up needed',
    };

    const purchaseHistoryRecordC = {
      recordId: 'REC-C',
      purchaseDate: '2024/03/10', // quality issue: date format error
      productId: 'PROD-003',
      quantity: 8,
      amount: 40000,
      customerNotes: 'Bulk order',
    };

    const purchaseHistoryRecords = [purchaseHistoryRecordA, purchaseHistoryRecordB, purchaseHistoryRecordC];

    // Mock AIRecommendationEngine stub
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    // Configure mock to return quality scores for each record
    mockAIEngine.evaluatePatternRelevance.mockImplementation((record: any) => {
      if (record.recordId === 'REC-A') {
        return { score: 0.65, issues: ['null_value'] };
      } else if (record.recordId === 'REC-B') {
        return { score: 0.45, issues: ['type_mismatch'] };
      } else if (record.recordId === 'REC-C') {
        return { score: 0.30, issues: ['date_format_error'] };
      }
      return { score: 0, issues: [] };
    });

    // Act: Execute the data quality evaluation function
    const result = evaluatePurchaseHistoryDataQuality(purchaseHistoryRecords, mockAIEngine);

    // Assert: Verify the mock was called exactly 3 times
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // Assert: Verify each call received the correct record
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(1, purchaseHistoryRecordA);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(2, purchaseHistoryRecordB);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(3, purchaseHistoryRecordC);

    // Assert: Verify the returned result contains quality judgments for all 3 records
    expect(result).toEqual({
      qualityJudgments: [
        {
          recordId: 'REC-A',
          qualityScore: 0.65,
          issues: ['null_value'],
        },
        {
          recordId: 'REC-B',
          qualityScore: 0.45,
          issues: ['type_mismatch'],
        },
        {
          recordId: 'REC-C',
          qualityScore: 0.30,
          issues: ['date_format_error'],
        },
      ],
      totalRecordsEvaluated: 3,
    });

    // Assert: Verify each quality score is in valid range
    expect(result.qualityJudgments[0].qualityScore).toBe(0.65);
    expect(result.qualityJudgments[1].qualityScore).toBe(0.45);
    expect(result.qualityJudgments[2].qualityScore).toBe(0.30);
  });
});