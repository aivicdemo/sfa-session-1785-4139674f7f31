import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-587: [edge] レポートファイル生成・保存機能 - FileStorageAdapter.uploadRecommendationReportの呼び出しが成功するときS3にファイルが保存される
  test('uploadRecommendationReportメソッドに推奨レポートデータとS3バケット名、オブジェクトキーを渡すとS3にファイルが保存される', () => {
    // Arrange
    const reportPdfBinary = Buffer.from('PDF binary data for recommendation report - 2.5MB mock');
    const bucketName = 'test-recommendations-bucket';
    const objectKey = 'report-20250801-12345.pdf';
    const uploadTimestampExpected = '2025-08-01T12:00:00Z';
    const expectedS3Url = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    const expectedETag = '"abc123def456"';
    const expectedVersionId = 'v1';

    const mockS3Client = {
      putObject: jest.fn().mockResolvedValue({
        ETag: expectedETag,
        VersionId: expectedVersionId,
      }),
    };

    const mockS3PutObjectParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: reportPdfBinary,
      ContentType: 'application/pdf',
      Metadata: {
        uploadedAt: uploadTimestampExpected,
        reportType: 'recommendation',
      },
    };

    // Act
    const result = uploadRecommendationReport(
      reportPdfBinary,
      bucketName,
      objectKey,
      mockS3Client as any,
      uploadTimestampExpected
    );

    // Assert
    expect(result).toEqual({
      success: true,
      s3Url: expectedS3Url,
      eTag: expectedETag,
      versionId: expectedVersionId,
      uploadTimestamp: uploadTimestampExpected,
    });

    expect(mockS3Client.putObject).toHaveBeenCalledTimes(1);
    expect(mockS3Client.putObject).toHaveBeenCalledWith(mockS3PutObjectParams);
  });
});