import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 推奨履歴記録', () => {
  // SCEN-2357
  test('推奨内容が新規に記録されるとき推奨履歴にレコードが追加される', async () => {
    const mockGeneratedRecommendation = {
      recommendationId: 'REC-001',
      customerId: 'CUST-12345',
      recommendationContent: '顧客Aに対し提案アプローチXを実施',
      generatedTimestamp: '2026-08-01T10:00:00Z',
      status: 'active',
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockGeneratedRecommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const insertedRecords: any[] = [];
    const mockRecommendationHistoryRepository = {
      insertRecommendationHistory: jest.fn().mockImplementation((record) => {
        insertedRecords.push(record);
        return Promise.resolve({ success: true });
      }),
      queryRecommendationHistory: jest.fn().mockResolvedValue(insertedRecords),
    };

    const input = {
      customerId: 'CUST-12345',
      dealCondition: '製品X導入検討',
    };

    const result = await recordRecommendationHistory(
      input,
      mockAIRecommendationEngine,
      mockRecommendationHistoryRepository
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-12345',
        dealCondition: '製品X導入検討',
      })
    );

    expect(mockRecommendationHistoryRepository.insertRecommendationHistory).toHaveBeenCalledTimes(1);

    const insertedRecord = mockRecommendationHistoryRepository.insertRecommendationHistory.mock.calls[0][0];
    expect(insertedRecord).toEqual(
      expect.objectContaining({
        recommendationId: 'REC-001',
        customerId: 'CUST-12345',
        recommendationContent: '顧客Aに対し提案アプローチXを実施',
        recordedTimestamp: '2026-08-01T10:00:00Z',
        status: 'active',
      })
    );

    expect(insertedRecords).toHaveLength(1);
    expect(insertedRecords[0]).toEqual(
      expect.objectContaining({
        recommendationId: 'REC-001',
        customerId: 'CUST-12345',
        recommendationContent: '顧客Aに対し提案アプローチXを実施',
        recordedTimestamp: '2026-08-01T10:00:00Z',
        status: 'active',
      })
    );

    expect(result).toEqual({
      success: true,
      recordedHistoryId: 'REC-001',
      totalRecordsAfterInsert: 1,
    });
  });
});