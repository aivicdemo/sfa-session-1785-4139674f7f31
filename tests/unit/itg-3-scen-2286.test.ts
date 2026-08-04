import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポートダウンロードURL生成', () => {
  // SCEN-2286
  test('メタデータが未登録のときダウンロードURL生成がエラーになる', () => {
    const reportId = 'report-20240115-001';
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockRejectedValue(
        new Error('METADATA_NOT_FOUND')
      ),
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        reportId: reportId,
        status: 200,
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deleted: 0 }),
    };

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const mockMetadataRepository = {
      findByReportId: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      delete: jest.fn(),
    };

    expect(() => {
      return generateDownloadUrl(
        reportId,
        mockFileStorageAdapter,
        mockMetadataRepository,
        mockLogger
      );
    }).toThrow(/METADATA_NOT_FOUND/);

    expect(mockMetadataRepository.findByReportId).toHaveBeenCalledWith(
      reportId
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('reportId:'),
      expect.stringContaining(reportId)
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('メタデータ未登録')
    );
  });
});