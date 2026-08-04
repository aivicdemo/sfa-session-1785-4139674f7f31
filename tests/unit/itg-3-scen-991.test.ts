import { generateAndSaveRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - FileStorageAdapter 再試行', () => {
  // SCEN-991
  test('uploadRecommendationReport がタイムアウトしたとき、再試行が最大2回実行される', async () => {
    const callTimestamps: number[] = [];
    let callCount = 0;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        callTimestamps.push(Date.now());
        callCount++;

        if (callCount === 1) {
          // 1回目: タイムアウトエラー（30秒超過）
          const timeoutError = new Error('Upload timeout exceeded 30 seconds');
          throw timeoutError;
        } else if (callCount === 2) {
          // 2回目: タイムアウトエラー（30秒超過）
          const timeoutError = new Error('Upload timeout exceeded 30 seconds');
          throw timeoutError;
        } else if (callCount === 3) {
          // 3回目: 成功（S3アップロード完了、ファイルメタデータ保存）
          return {
            fileId: 'file-001',
            fileName: 'recommendation_report_20240115.pdf',
            s3Url: 'https://s3.amazonaws.com/bucket/recommendation_report_20240115.pdf',
            uploadedAt: new Date('2024-01-15T11:00:00Z'),
            expiresAt: new Date('2024-01-22T11:00:00Z'),
          };
        }
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationContent = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      proposalApproach: 'Focus on cost reduction',
      confidenceScore: 85,
      reasoning: [
        'Past similar case: Company A achieved 30% cost reduction',
        'Industry trend: Digital transformation in manufacturing',
      ],
      executionTiming: '2024-01-20T09:00:00Z',
    };

    const result = await generateAndSaveRecommendationReport(
      recommendationContent,
      'PDF',
      mockFileStorageAdapter
    );

    // uploadRecommendationReport が合計3回呼び出されている
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // 1回目と2回目の間隔が3秒
    const firstToSecondInterval = callTimestamps[1] - callTimestamps[0];
    expect(firstToSecondInterval).toBeGreaterThanOrEqual(3000);
    expect(firstToSecondInterval).toBeLessThan(4000);

    // 2回目と3回目の間隔が10秒
    const secondToThirdInterval = callTimestamps[2] - callTimestamps[1];
    expect(secondToThirdInterval).toBeGreaterThanOrEqual(10000);
    expect(secondToThirdInterval).toBeLessThan(11000);

    // 3回目の呼び出しで成功し、レポートファイルメタデータが保存される
    expect(result).toEqual({
      fileId: 'file-001',
      fileName: 'recommendation_report_20240115.pdf',
      s3Url: 'https://s3.amazonaws.com/bucket/recommendation_report_20240115.pdf',
      uploadedAt: new Date('2024-01-15T11:00:00Z'),
      expiresAt: new Date('2024-01-22T11:00:00Z'),
    });
  });
});