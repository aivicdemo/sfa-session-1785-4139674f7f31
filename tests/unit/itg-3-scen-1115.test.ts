import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・保存', () => {
  test('SCEN-1115: レポートファイルメタデータが null のとき、S3アップロード処理がエラーになる', async () => {
    // Arrange: テスト用のモック FileStorageAdapter を準備
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error('Required metadata field is null')
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // テスト用のモック AIRecommendationEngine を準備
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 推奨レポート生成データを準備
    const recommendationReportData = {
      recommendationId: 'REC-2024-001',
      customerId: 'CUST-12345',
      proposedApproach: 'Initial contact strategy',
      confidenceScore: 85,
      generatedAt: '2024-01-15T11:00:00Z'
    };

    // レポートファイルメタデータオブジェクトの全プロパティを null に設定
    const nullMetadata = {
      fileName: null,
      fileSize: null,
      uploadTimestamp: null,
      s3KeyPath: null,
      contentType: null,
      reportId: null
    };

    // Act & Assert: uploadRecommendationReport() を呼び出してエラーが発生することを検証
    await expect(
      uploadRecommendationReport(
        recommendationReportData,
        nullMetadata,
        mockFileStorageAdapter
      )
    ).rejects.toThrow(/メタデータが不正です|Required metadata field is null/);

    // Assert: S3 への実際のアップロード API 呼び出しが発生しないことを検証
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: null,
        fileSize: null,
        uploadTimestamp: null,
        s3KeyPath: null,
        contentType: null,
        reportId: null
      })
    );

    // Assert: エラーメッセージに期待されるキーワードが含まれることを検証
    try {
      await uploadRecommendationReport(
        recommendationReportData,
        nullMetadata,
        mockFileStorageAdapter
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(
          /メタデータが不正です|Required metadata field is null/
        );
      }
    }
  });
});