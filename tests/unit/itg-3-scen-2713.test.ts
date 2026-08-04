import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-2713: [edge] 推奨レポート生成・保存機能 - FileStorageAdapter.deleteExpiredReportsが1件を削除したとき、その1件のメタデータは削除される', async () => {
    // Arrange
    const now = new Date('2026-01-15T10:00:00Z');
    const thirtyDaysAgo = new Date('2025-12-16T10:00:00Z');
    const expiredReportDate = new Date('2025-12-01T09:00:00Z');

    // S3 stub
    const s3Stub = {
      deleteObject: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({})
      })
    };

    // Report file metadata mock database
    const reportMetadataDb = [
      {
        reportId: 'expired-001',
        fileName: 'report-expired-001.pdf',
        s3Key: 'recommendations/expired-001.pdf',
        createdAt: expiredReportDate,
        expiresAt: thirtyDaysAgo,
        status: 'stored'
      },
      {
        reportId: 'expired-002',
        fileName: 'report-expired-002.pdf',
        s3Key: 'recommendations/expired-002.pdf',
        createdAt: new Date('2025-12-05T09:00:00Z'),
        expiresAt: new Date('2026-01-04T09:00:00Z'),
        status: 'stored'
      },
      {
        reportId: 'expired-003',
        fileName: 'report-expired-003.pdf',
        s3Key: 'recommendations/expired-003.pdf',
        createdAt: new Date('2025-12-10T09:00:00Z'),
        expiresAt: new Date('2026-01-09T09:00:00Z'),
        status: 'stored'
      }
    ];

    const reportMetadataQueryFn = jest.fn((reportId: string) => {
      return reportMetadataDb.find((r) => r.reportId === reportId);
    });

    const reportMetadataDeleteFn = jest.fn((reportId: string) => {
      const index = reportMetadataDb.findIndex((r) => r.reportId === reportId);
      if (index > -1) {
        reportMetadataDb.splice(index, 1);
      }
    });

    const fileStorageAdapterStub = {
      s3Client: s3Stub,
      queryReportMetadata: reportMetadataQueryFn,
      deleteReportMetadata: reportMetadataDeleteFn
    };

    // Act
    await deleteExpiredReports(
      fileStorageAdapterStub,
      'expired-001',
      now
    );

    // Assert
    expect(s3Stub.deleteObject).toHaveBeenCalledTimes(1);
    expect(s3Stub.deleteObject).toHaveBeenCalledWith({
      Bucket: 'recommendations-bucket',
      Key: 'recommendations/expired-001.pdf'
    });

    const deletedMetadata = reportMetadataQueryFn('expired-001');
    expect(deletedMetadata).toBeUndefined();

    const remainingReport2 = reportMetadataQueryFn('expired-002');
    expect(remainingReport2).not.toBeUndefined();
    expect(remainingReport2.reportId).toBe('expired-002');

    const remainingReport3 = reportMetadataQueryFn('expired-003');
    expect(remainingReport3).not.toBeUndefined();
    expect(remainingReport3.reportId).toBe('expired-003');

    expect(reportMetadataDb.length).toBe(2);
  });
});