import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - Amazon S3連携', () => {
  // SCEN-2920
  test('deleteExpiredReports呼び出しが正常応答を受けた場合、期限経過のレポートが自動削除される', async () => {
    const retentionDays = 90;
    const currentDate = new Date('2024-12-15T00:00:00Z');

    const reportMetadataTable = [
      {
        reportId: 'report-A-old',
        fileKey: 'report-A-old.pdf',
        createdAt: new Date('2024-09-15T00:00:00Z'),
        retentionDays: retentionDays,
      },
      {
        reportId: 'report-B-recent',
        fileKey: 'report-B-recent.pdf',
        createdAt: new Date('2024-11-01T00:00:00Z'),
        retentionDays: retentionDays,
      },
      {
        reportId: 'report-C-new',
        fileKey: 'report-C-new.pdf',
        createdAt: new Date('2024-12-14T00:00:00Z'),
        retentionDays: retentionDays,
      },
    ];

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn(async (reports: any[]) => {
        return {
          success: true,
          deletedCount: reports.length,
          deletedReportIds: reports.map((r) => r.reportId),
        };
      }),
    };

    const result = await deleteExpiredReports(
      reportMetadataTable,
      currentDate,
      mockFileStorageAdapter
    );

    expect(result.success).toBe(true);
    expect(result.deletedCount).toBe(1);
    expect(result.deletedReportIds).toContain('report-A-old');

    const remainingReports = reportMetadataTable.filter(
      (report) => result.deletedReportIds.indexOf(report.reportId) === -1
    );

    expect(remainingReports.length).toBe(2);
    expect(remainingReports.map((r) => r.reportId)).toContain('report-B-recent');
    expect(remainingReports.map((r) => r.reportId)).toContain('report-C-new');

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);

    const callArgument = mockFileStorageAdapter.deleteExpiredReports.mock.calls[0][0];
    expect(callArgument.length).toBe(1);
    expect(callArgument[0].fileKey).toBe('report-A-old.pdf');
  });
});