import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { FileStorageAdapter } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  let fileStorageAdapter: FileStorageAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2816
  test('[error] 推奨内容の根拠表示機能 - FileStorageAdapterのuploadRecommendationReportが失敗したとき、エラーを返す', async () => {
    const mockS3Error = new Error('AccessDenied: User is not authorized to perform: s3:PutObject');
    mockS3Error.name = 'AccessDeniedError';

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue({
        errorCode: 'S3_UPLOAD_FAILED',
        message: '推奨レポートのアップロードに失敗しました',
        originalError: mockS3Error,
        retryAttempt: 0,
      }),
    };

    const recommendationInput = {
      approach: '提案アプローチA',
      reasoning: '根拠テキスト',
    };

    const reportParams = {
      format: 'PDF',
      fileName: 'report_20260801.pdf',
    };

    try {
      await mockFileStorageAdapter.uploadRecommendationReport(
        recommendationInput,
        reportParams
      );
      expect.fail('Promise should have been rejected');
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      expect(err.errorCode).toBe('S3_UPLOAD_FAILED');
      expect(err.message).toBe('推奨レポートのアップロードに失敗しました');
      expect(err.originalError).toBeDefined();
      expect((err.originalError as Error).name).toBe('AccessDeniedError');
      expect(err.retryAttempt).toBe(0);
    }

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      recommendationInput,
      reportParams
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
  });
});