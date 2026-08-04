import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート自動削除', () => {
  // SCEN-694
  test('有効期限を超えたレポートは自動削除される', async () => {
    const now = new Date('2024-12-15T00:00:00Z');
    const thirtyDaysAgo = new Date('2024-11-15T00:00:00Z');
    const fifteenDaysAgo = new Date('2024-11-30T00:00:00Z');
    const thirtyOneDaysAgo = new Date('2024-11-14T00:00:00Z');

    const reportA = {
      reportId: 'report-a-001',
      createdAt: thirtyDaysAgo,
      retentionPeriodDays: 30,
      expirationDate: new Date('2024-12-15T00:00:00Z'),
      s3ObjectKey: 's3://ai-recommendations/report-a-001.pdf',
      isDeleted: false,
    };

    const reportB = {
      reportId: 'report-b-002',
      createdAt: fifteenDaysAgo,
      retentionPeriodDays: 30,
      expirationDate: new Date('2024-12-30T00:00:00Z'),
      s3ObjectKey: 's3://ai-recommendations/report-b-002.pdf',
      isDeleted: false,
    };

    const reportC = {
      reportId: 'report-c-003',
      createdAt: thirtyOneDaysAgo,
      retentionPeriodDays: 30,
      expirationDate: new Date('2024-12-14T00:00:00Z'),
      s3ObjectKey: 's3://ai-recommendations/report-c-003.pdf',
      isDeleted: false,
    };

    const reportMetadataTable = [reportA, reportB, reportC];

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 2,
        deletedReportIds: ['report-a-001', 'report-c-003'],
      }),
    };

    const result = await deleteExpiredReports(
      reportMetadataTable,
      mockFileStorageAdapter,
      now
    );

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);

    const callArgs = mockFileStorageAdapter.deleteExpiredReports.mock.calls[0][0];
    expect(callArgs).toHaveLength(2);
    expect(callArgs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reportId: 'report-a-001',
          s3ObjectKey: 's3://ai-recommendations/report-a-001.pdf',
        }),
        expect.objectContaining({
          reportId: 'report-c-003',
          s3ObjectKey: 's3://ai-recommendations/report-c-003.pdf',
        }),
      ])
    );

    const remainingReports = reportMetadataTable.filter((r) => !r.isDeleted);
    expect(remainingReports).toHaveLength(1);
    expect(remainingReports[0]).toEqual(
      expect.objectContaining({
        reportId: 'report-b-002',
        expirationDate: new Date('2024-12-30T00:00:00Z'),
      })
    );

    expect(result.deletedCount).toBe(2);
    expect(result.deletedReportIds).toEqual(['report-a-001', 'report-c-003']);
  });
});