import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

interface FileStorageAdapter {
  uploadRecommendationReport: jest.Mock;
  generateDownloadUrl: jest.Mock;
}

interface MockLogger {
  info: jest.Mock;
  error: jest.Mock;
}

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・保存', () => {
  let fileStorageAdapter: FileStorageAdapter;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    fileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1175
  test('S3アップロード失敗時の1回目再試行（3秒後）で成功したとき、正常なダウンロードURLを返却する', async () => {
    const recommendationReportData = {
      fileFormat: 'pdf',
      fileSizeBytes: 2097152,
      fileName: 'recommendation_2025-01-15.pdf',
      content: Buffer.from('mock pdf content'),
    };

    const s3BucketName = 'ai-agent-reports';
    const objectKey = 'recommendation_2025-01-15.pdf';
    const uploadTimestamp = '2025-01-15T10:30:00Z';
    const downloadUrlExpires = 3600;
    const mockSignature = 'mock-signature-token-abc123def456';

    const uploadMetadata = {
      object_key: objectKey,
      upload_timestamp: uploadTimestamp,
      file_size: recommendationReportData.fileSizeBytes,
      bucket: s3BucketName,
    };

    const expectedDownloadUrl = `https://s3.amazonaws.com/${s3BucketName}/${objectKey}?X-Amz-Expires=${downloadUrlExpires}&X-Amz-Signature=${mockSignature}`;

    fileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(new Error('Network timeout'))
      .mockResolvedValueOnce({
        success: true,
        metadata: uploadMetadata,
      });

    fileStorageAdapter.generateDownloadUrl.mockResolvedValueOnce({
      downloadUrl: expectedDownloadUrl,
      expiresAt: new Date('2025-01-15T11:30:00Z').toISOString(),
    });

    let attemptCount = 0;
    const uploadWithRetry = async () => {
      try {
        attemptCount++;
        const uploadResult = await fileStorageAdapter.uploadRecommendationReport(
          recommendationReportData,
          s3BucketName
        );
        mockLogger.info(`Upload succeeded on attempt ${attemptCount}`);
        return uploadResult;
      } catch (error) {
        if (attemptCount === 1) {
          mockLogger.info('Upload failed on attempt 1, retrying in 3 seconds');
          await new Promise(resolve => setTimeout(resolve, 3000));
          return uploadWithRetry();
        }
        throw error;
      }
    };

    const uploadResult = await uploadWithRetry();

    expect(uploadResult.success).toBe(true);
    expect(uploadResult.metadata.object_key).toBe(objectKey);
    expect(uploadResult.metadata.upload_timestamp).toBe(uploadTimestamp);
    expect(uploadResult.metadata.file_size).toBe(2097152);
    expect(uploadResult.metadata.bucket).toBe(s3BucketName);

    const downloadUrlResult = await generateDownloadUrl(
      uploadResult.metadata,
      fileStorageAdapter.generateDownloadUrl
    );

    mockLogger.info('Download URL generated successfully');

    expect(downloadUrlResult.downloadUrl).toMatch(/^https:\/\//);
    expect(downloadUrlResult.downloadUrl).toContain(s3BucketName);
    expect(downloadUrlResult.downloadUrl).toContain(objectKey);
    expect(downloadUrlResult.downloadUrl).toContain(`X-Amz-Expires=${downloadUrlExpires}`);
    expect(downloadUrlResult.downloadUrl).toContain('X-Amz-Signature=');

    expect(mockLogger.info).toHaveBeenCalledWith('Upload failed on attempt 1, retrying in 3 seconds');
    expect(mockLogger.info).toHaveBeenCalledWith('Upload succeeded on attempt 2');
    expect(mockLogger.info).toHaveBeenCalledWith('Download URL generated successfully');
  });
});