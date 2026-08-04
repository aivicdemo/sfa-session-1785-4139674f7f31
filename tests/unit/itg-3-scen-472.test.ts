import { generateRecommendationReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - レポートメタデータ生成機能', () => {
  // SCEN-472
  test('レポート生成ユーザーが正しく記録される', async () => {
    const testUserId = 'test-user-001';
    const reportGeneratedAt = new Date('2026-08-01T10:30:00Z');
    const s3Key = 'reports/test-user-001/20260801_recommendation_001.pdf';
    const reportFilename = '20260801_recommendation_001.pdf';

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-001',
        customer_id: 'cust-001',
        approach: 'consultative_approach',
        confidence_score: 85,
        reasoning: '過去の類似案件から成功パターンを抽出',
        created_at: reportGeneratedAt.toISOString(),
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3_key: s3Key,
        filename: reportFilename,
        upload_status: 'success',
        uploaded_at: reportGeneratedAt.toISOString(),
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockDatabase = {
      insertReportMetadata: jest.fn().mockResolvedValue({
        id: 'metadata-001',
        user_id: testUserId,
        report_filename: reportFilename,
        s3_key: s3Key,
        created_by: testUserId,
        created_at: reportGeneratedAt.toISOString(),
        updated_at: reportGeneratedAt.toISOString(),
      }),
    };

    const input = {
      userId: testUserId,
      customerId: 'cust-001',
      businessDealId: 'deal-001',
      reportFormat: 'pdf',
      generatedAt: reportGeneratedAt,
      aiEngine: mockAIEngine,
      fileStorage: mockFileStorage,
      database: mockDatabase,
    };

    const result = await generateRecommendationReport(input);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust-001',
        businessDealId: 'deal-001',
      })
    );

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: testUserId,
        recommendationId: 'rec-001',
      })
    );

    expect(mockDatabase.insertReportMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: testUserId,
        created_by: testUserId,
        report_filename: reportFilename,
        s3_key: s3Key,
      })
    );

    expect(result).toEqual({
      metadata_id: 'metadata-001',
      user_id: testUserId,
      created_by: testUserId,
      report_filename: reportFilename,
      s3_key: s3Key,
      created_at: reportGeneratedAt.toISOString(),
    });

    expect(result.created_by).toBe('test-user-001');
    expect(result.report_filename).toBe('20260801_recommendation_001.pdf');
    expect(result.s3_key).toBe('reports/test-user-001/20260801_recommendation_001.pdf');
    expect(result.user_id).toBe('test-user-001');
  });
});