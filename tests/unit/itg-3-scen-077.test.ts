import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨レポート生成とS3メタデータ記録', () => {
  test('SCEN-077: S3アップロード成功時にレポートメタデータが内部テーブルに記録される', async () => {
    // テストデータの準備
    const caseId = 'CASE-001';
    const customerId = 'CUST-12345';
    const customerName = 'テスト株式会社';
    const dealAmount = 5000000;
    const dealStage = 'proposal';

    const input = {
      caseId,
      customerId,
      customerName,
      dealAmount,
      dealStage,
      recommendedApproach: 'value_selling',
      confidenceScore: 85,
      successPattern: 'large_enterprise_strategic_account',
      recommendationReasoning: 'Customer size and industry alignment match historical success pattern',
    };

    // FileStorageAdapterのモック
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        bucketName: 'test-bucket',
        objectKey: 'reports/CASE-001/recommendation-20240801.pdf',
        uploadTimestamp: '2024-08-01T10:30:00Z',
        fileSize: 2048576,
        contentType: 'application/pdf',
        etag: '"abc123def456"',
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 推奨レポート生成機能を実行
    const result = await generateRecommendationReport(input, mockFileStorageAdapter);

    // アップロードが呼び出されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 記録されたメタデータの検証
    expect(result).toEqual(
      expect.objectContaining({
        reportId: expect.any(String),
        caseId: 'CASE-001',
        fileName: 'recommendation-20240801.pdf',
        s3BucketName: 'test-bucket',
        s3ObjectKey: 'reports/CASE-001/recommendation-20240801.pdf',
        fileSizeBytes: 2048576,
        contentType: 'application/pdf',
        etag: 'abc123def456',
        uploadCompletedAt: '2024-08-01T10:30:00Z',
        recordCreatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
      })
    );

    // ファイルサイズが正確に記録されていることを確認
    expect(result.fileSizeBytes).toBe(2048576);

    // S3メタデータが完全に記録されていることを確認
    expect(result.s3BucketName).toBe('test-bucket');
    expect(result.s3ObjectKey).toBe('reports/CASE-001/recommendation-20240801.pdf');
    expect(result.etag).toBe('abc123def456');

    // アップロード完了日時が指定値と一致していることを確認
    expect(result.uploadCompletedAt).toBe('2024-08-01T10:30:00Z');

    // コンテンツタイプが正確に記録されていることを確認
    expect(result.contentType).toBe('application/pdf');
  });
});