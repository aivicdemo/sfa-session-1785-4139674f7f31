import { generateRecommendationReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - レポートメタデータ生成', () => {
  test('SCEN-472: レポート生成ユーザーが正しく記録される', async () => {
    const userId = 'test-user-001';
    const reportGeneratedAt = new Date('2026-08-01T10:30:00Z');
    const s3Key = 'reports/test-user-001/20260801_recommendation_001.pdf';
    const reportFilename = '20260801_recommendation_001.pdf';

    // スタブ: AIRecommendationEngine.generateRecommendation
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: 'High-touch account management for enterprise clients',
        confidenceScore: 92,
        successPatternMatches: [
          {
            patternId: 'pat-001',
            matchScore: 0.95,
            customerSegment: 'Enterprise',
          },
        ],
        reasoning: 'Based on successful patterns in similar customer profiles',
      }),
    };

    // スタブ: FileStorageAdapter.uploadRecommendationReport
    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          s3_key: s3Key,
          filename: reportFilename,
          uploadedAt: reportGeneratedAt.toISOString(),
          fileSize: 245680,
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // レポート生成入力データ
    const reportInput = {
      customerId: 'cust-001',
      customerName: 'Acme Corporation',
      customerIndustry: 'Technology',
      customerSize: 'Enterprise',
      dealId: 'deal-001',
      dealAmount: 250000,
      dealStage: 'Proposal',
    };

    // レポート生成処理を実行
    const reportMetadata = await generateRecommendationReport(
      reportInput,
      userId,
      reportGeneratedAt,
      mockAIEngine,
      mockFileStorage
    );

    // 検証: レポートメタデータが正しく生成されている
    expect(reportMetadata).toEqual({
      created_by: 'test-user-001',
      report_filename: '20260801_recommendation_001.pdf',
      s3_key: 'reports/test-user-001/20260801_recommendation_001.pdf',
      created_at: '2026-08-01T10:30:00Z',
      user_id: 'test-user-001',
    });

    // 検証: AIエンジンが正しく呼び出されている
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust-001',
        customerIndustry: 'Technology',
        customerSize: 'Enterprise',
      })
    );

    // 検証: ファイルストレージのアップロード処理が実行されている
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'test-user-001',
        timestamp: '2026-08-01T10:30:00Z',
      })
    );
  });
});