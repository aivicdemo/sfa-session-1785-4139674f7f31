import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import type { FileStorageAdapter } from '../../src/types/file-storage-adapter';
import { generateRecommendationDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ダウンロードURL生成', () => {
  let mockFileStorageAdapter: jest.Mocked<FileStorageAdapter>;

  beforeEach(() => {
    mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn(),
      uploadRecommendationReport: jest.fn(),
      deleteExpiredReports: jest.fn(),
    } as jest.Mocked<FileStorageAdapter>;
  });

  // SCEN-2166
  test('推奨レポートのダウンロードURL生成 - 有効期限が過去の日時のとき、エラーが発生する', () => {
    const recommendationId = 'rec-001';
    const reportPath = 's3://bucket/recommendation-report-001.pdf';
    const pastExpirationTime = new Date('2020-01-01T00:00:00Z');

    const invalidExpirationError = new Error('Expiration time must be in the future');
    (invalidExpirationError as any).code = 'InvalidExpirationTime';

    mockFileStorageAdapter.generateDownloadUrl.mockImplementation(() => {
      throw invalidExpirationError;
    });

    expect(() => {
      generateRecommendationDownloadUrl(
        recommendationId,
        reportPath,
        pastExpirationTime,
        mockFileStorageAdapter
      );
    }).toThrow(/Expiration time must be in the future/);

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportPath,
      expect.objectContaining({
        expiresIn: expect.any(Number),
      })
    );
  });
});