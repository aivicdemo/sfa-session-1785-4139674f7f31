import { generateRecommendationReportWithDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成と保存', () => {
  // SCEN-687
  test('S3へのアップロードが成功した場合、ダウンロードURL生成が完了する', async () => {
    // Arrange: モック推奨レポート情報
    const mockReportPdfBuffer = Buffer.from('mock pdf content');
    const mockFileName = 'recommendation_report_20240801_123456.pdf';
    const mockS3Key = 'reports/recommendation_report_20240801_123456.pdf';
    const mockBucket = 'ai-agent-reports';
    const mockDownloadUrl =
      'https://ai-agent-reports.s3.amazonaws.com/reports/recommendation_report_20240801_123456.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=MockSignature';
    const mockExpiresAt = new Date('2024-08-01T13:34:56Z');

    // FileStorageAdapter の uploadRecommendationReport をモック化
    const mockUploadRecommendationReport = jest.fn().mockResolvedValue({
      success: true,
      s3Key: mockS3Key,
      bucket: mockBucket,
    });

    // FileStorageAdapter の generateDownloadUrl をモック化
    const mockGenerateDownloadUrl = jest.fn().mockResolvedValue({
      url: mockDownloadUrl,
      expiresAt: mockExpiresAt,
    });

    const mockFileStorageAdapter = {
      uploadRecommendationReport: mockUploadRecommendationReport,
      generateDownloadUrl: mockGenerateDownloadUrl,
    };

    // Act: 推奨レポート生成・保存の処理フロー実行
    const result = await generateRecommendationReportWithDownloadUrl(
      {
        reportContent: 'mock recommendation content',
        recommendationId: 'rec_20240801_001',
        generatedAt: new Date('2024-08-01T12:34:56Z'),
      },
      mockFileStorageAdapter
    );

    // Assert: uploadRecommendationReport が正常に呼び出されたことを確認
    expect(mockUploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(mockUploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: expect.stringContaining('recommendation_report'),
        reportContent: 'mock recommendation content',
      })
    );

    // Assert: uploadRecommendationReport の成功直後、generateDownloadUrl が呼び出されたことを確認
    expect(mockGenerateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockGenerateDownloadUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        s3Key: mockS3Key,
        bucket: mockBucket,
      })
    );

    // Assert: 返却されたURLがダウンロードURL形式であることを確認
    expect(result).toEqual({
      success: true,
      s3Key: mockS3Key,
      bucket: mockBucket,
      downloadUrl: mockDownloadUrl,
      expiresAt: mockExpiresAt,
    });

    // Assert: 返却されたURLが有効期限付き署名付きURL形式であることを検証
    expect(result.downloadUrl).toMatch(/X-Amz-Algorithm=AWS4-HMAC-SHA256/);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=3600/);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);

    // Assert: expiresAtが現在時刻から3600秒後のUTC時刻であることを確認
    const expectedExpireTime = new Date('2024-08-01T13:34:56Z');
    expect(result.expiresAt.getTime()).toBe(expectedExpireTime.getTime());
  });
});