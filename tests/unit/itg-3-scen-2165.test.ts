import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ダウンロードURL生成エラーハンドリング', () => {
  test('SCEN-2165: 有効期限が無効な形式のとき、エラーが発生する', () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn((expirationDate: string) => {
        if (!expirationDate || typeof expirationDate !== 'string') {
          const error = new Error('expirationDate must be a valid ISO 8601 format');
          (error as any).code = 'INVALID_EXPIRATION_FORMAT';
          throw error;
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        if (!datePattern.test(expirationDate)) {
          const error = new Error('有効期限の形式が無効です');
          (error as any).code = 'INVALID_EXPIRATION_FORMAT';
          throw error;
        }

        const date = new Date(expirationDate);
        if (isNaN(date.getTime())) {
          const error = new Error('有効期限の形式が無効です');
          (error as any).code = 'INVALID_EXPIRATION_FORMAT';
          throw error;
        }

        return 'https://s3.amazonaws.com/bucket/report?token=xyz&expires=1234567890';
      }),
      deleteExpiredReports: jest.fn(),
    };

    const testCases = [
      'invalid-date',
      '2026-13-45',
      '',
      null,
      undefined,
    ];

    for (const invalidExpirationDate of testCases) {
      expect(() => {
        generateDownloadUrl(
          mockFileStorageAdapter,
          'recommendation-report-2024-01',
          invalidExpirationDate as any
        );
      }).toThrow(/有効期限の形式が無効です|expirationDate must be a valid ISO 8601 format/);

      const lastCallError = mockFileStorageAdapter.generateDownloadUrl.mock.results[
        mockFileStorageAdapter.generateDownloadUrl.mock.results.length - 1
      ];

      if (lastCallError?.type === 'throw') {
        expect(lastCallError.value.code).toBe('INVALID_EXPIRATION_FORMAT');
      }
    }

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});