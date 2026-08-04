import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-315
  test('[edge] 期限切れレポートの自動削除機能 - 削除対象の期限切れレポートが複数件のとき、すべてが削除される', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const expiredTime1 = new Date('2024-01-15T10:00:00Z');
    const expiredTime2 = new Date('2024-01-15T09:00:00Z');
    const expiredTime3 = new Date('2024-01-15T08:00:00Z');
    const validTime1 = new Date('2024-01-15T14:00:00Z');
    const validTime2 = new Date('2024-01-15T15:00:00Z');

    const expiredReports = [
      {
        reportId: 'report-001',
        fileName: 'recommendation-001.pdf',
        expirationTime: expiredTime1,
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        reportId: 'report-002',
        fileName: 'recommendation-002.pdf',
        expirationTime: expiredTime2,
        createdAt: new Date('2024-01-15T09:30:00Z'),
      },
      {
        reportId: 'report-003',
        fileName: 'recommendation-003.pdf',
        expirationTime: expiredTime3,
        createdAt: new Date('2024-01-15T08:30:00Z'),
      },
    ];

    const validReports = [
      {
        reportId: 'report-004',
        fileName: 'recommendation-004.pdf',
        expirationTime: validTime1,
        createdAt: new Date('2024-01-15T12:30:00Z'),
      },
      {
        reportId: 'report-005',
        fileName: 'recommendation-005.pdf',
        expirationTime: validTime2,
        createdAt: new Date('2024-01-15T13:30:00Z'),
      },
    ];

    const allReports = [...expiredReports, ...validReports];
    let reportMetadata = allReports;

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn((reports: typeof reportMetadata) => {
        const deletedIds = reports.map((r: { reportId: string }) => r.reportId);
        reportMetadata = reportMetadata.filter(
          (r: { reportId: string }) => !deletedIds.includes(r.reportId)
        );
      }),
    };

    const result = deleteExpiredReports(reportMetadata, now, mockFileStorageAdapter);

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ reportId: 'report-001' }),
        expect.objectContaining({ reportId: 'report-002' }),
        expect.objectContaining({ reportId: 'report-003' }),
      ])
    );

    expect(reportMetadata).toHaveLength(2);
    expect(reportMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reportId: 'report-004' }),
        expect.objectContaining({ reportId: 'report-005' }),
      ])
    );

    const remainingIds = reportMetadata.map((r: { reportId: string }) => r.reportId);
    expect(remainingIds).toContain('report-004');
    expect(remainingIds).toContain('report-005');
    expect(remainingIds).not.toContain('report-001');
    expect(remainingIds).not.toContain('report-002');
    expect(remainingIds).not.toContain('report-003');

    expect(result).toEqual({
      deletedCount: 3,
      remainingCount: 2,
      success: true,
    });
  });
});