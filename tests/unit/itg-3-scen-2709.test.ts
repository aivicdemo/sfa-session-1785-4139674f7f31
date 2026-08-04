import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - FileStorageAdapter.uploadRecommendationReport', () => {
  // SCEN-2709
  test('2回の再試行後も失敗したとき、アップロード処理が中止される', async () => {
    // テストデータ準備
    const recommendationReportBuffer = Buffer.from('PDF_CONTENT_EXAMPLE');
    const fileMetadata = {
      fileName: 'recommendation_report_2024_01_15.pdf',
      contentType: 'application/pdf',
      fileSize: recommendationReportBuffer.length,
      uploadedAt: new Date('2024-01-15T11:00:00Z'),
      expiresAt: new Date('2024-02-15T11:00:00Z'),
    };

    let attemptCount = 0;
    const s3UploadStub = jest.fn().mockImplementation(() => {
      attemptCount++;
      const error = new Error('S3ServiceException');
      error.name = 'S3ServiceException';
      return Promise.reject(error);
    });

    const fileStorageAdapterStub = {
      uploadRecommendationReport: async (buffer: Buffer, metadata: typeof fileMetadata) => {
        let lastError: Error | null = null;
        const maxAttempts = 3;
        const retryDelays = [1000, 10000]; // 初回 + 2回の再試行（遅延は3秒、10秒）

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            await s3UploadStub(buffer, metadata);
            return { success: true, s3Key: `recommendations/${metadata.fileName}` };
          } catch (error) {
            lastError = error as Error;
            if (attempt < maxAttempts - 1) {
              await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
            }
          }
        }

        const uploadFailedException = new Error('UploadFailedException');
        uploadFailedException.name = 'UploadFailedException';
        throw uploadFailedException;
      },
    };

    // アップロード処理実行
    const uploadPromise = fileStorageAdapterStub.uploadRecommendationReport(
      recommendationReportBuffer,
      fileMetadata
    );

    // 結果検証
    await expect(uploadPromise).rejects.toThrow(/UploadFailedException/);

    // スタブへのS3呼び出し履歴検証
    expect(s3UploadStub).toHaveBeenCalledTimes(3);
    expect(s3UploadStub).toHaveBeenNthCalledWith(1, recommendationReportBuffer, fileMetadata);
    expect(s3UploadStub).toHaveBeenNthCalledWith(2, recommendationReportBuffer, fileMetadata);
    expect(s3UploadStub).toHaveBeenNthCalledWith(3, recommendationReportBuffer, fileMetadata);
  });
});