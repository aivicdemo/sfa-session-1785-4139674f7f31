import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('期限切れレポート削除機能', () => {
  // SCEN-089
  test('削除対象レポートが1件の場合に正常に削除される', async () => {
    const reportId = 'REPORT-001';
    const filePath = 's3://bucket/reports/REPORT-001.pdf';
    const createdAt = new Date('2026-07-02T00:00:00Z');
    const executionTime = new Date('2026-08-01T12:00:00Z');
    const retentionDays = 30;

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 1,
        deletedReports: [{ reportId, filePath }],
      }),
    };

    const mockReportMetadataDb = {
      findExpiredReports: jest.fn().mockResolvedValue([
        {
          reportId,
          filePath,
          createdAt,
          status: 'completed',
        },
      ]),
      deleteByReportId: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockDeletionLog = {
      insert: jest.fn().mockResolvedValue({
        id: 'LOG-001',
        reportId,
        deletedAt: executionTime,
        status: 'completed',
      }),
      findByReportId: jest.fn().mockResolvedValue({
        reportId,
        deletedAt: executionTime,
        status: 'completed',
      }),
    };

    const result = await deleteExpiredReports({
      fileStorageAdapter: mockFileStorageAdapter,
      reportMetadataDb: mockReportMetadataDb,
      deletionLog: mockDeletionLog,
      retentionDays,
      executionTime,
    });

    expect(mockReportMetadataDb.findExpiredReports).toHaveBeenCalledWith({
      retentionDays,
      referenceTime: executionTime,
    });

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith({
      filePaths: [filePath],
    });

    expect(mockReportMetadataDb.deleteByReportId).toHaveBeenCalledWith(reportId);

    expect(mockDeletionLog.insert).toHaveBeenCalledWith({
      reportId,
      deletedAt: executionTime,
      status: 'completed',
    });

    const verifyNotExists = await mockReportMetadataDb.findById(reportId);
    expect(verifyNotExists).toBeNull();

    const deletionLogRecord = await mockDeletionLog.findByReportId(reportId);
    expect(deletionLogRecord).toEqual({
      reportId: 'REPORT-001',
      deletedAt: executionTime,
      status: 'completed',
    });

    expect(result).toEqual({
      deletedCount: 1,
      deletedReports: [{ reportId, filePath }],
      deletionLogId: 'LOG-001',
    });
  });
});