import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート自動削除', () => {
  test('SCEN-693: 保存期間がちょうど有効期限に達した場合、レポートは削除対象に含まれない', () => {
    const RETENTION_DAYS = 30;
    const now = new Date('2024-12-15T12:00:00Z');
    const exactlyAtLimitDate = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const overLimitDate = new Date(now.getTime() - (RETENTION_DAYS + 1) * 24 * 60 * 60 * 1000);

    const mockReportAtExactLimit = {
      report_id: 'report-001',
      file_name: 'recommendation_2024-11-15.pdf',
      file_path: 's3://bucket/reports/recommendation_2024-11-15.pdf',
      created_at: exactlyAtLimitDate.toISOString(),
      expiration_date: new Date(exactlyAtLimitDate.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      is_deleted: false,
      file_size_bytes: 2048,
      file_format: 'PDF'
    };

    const mockReportOverLimit = {
      report_id: 'report-002',
      file_name: 'recommendation_2024-11-14.pdf',
      file_path: 's3://bucket/reports/recommendation_2024-11-14.pdf',
      created_at: overLimitDate.toISOString(),
      expiration_date: new Date(overLimitDate.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      is_deleted: false,
      file_size_bytes: 2048,
      file_format: 'PDF'
    };

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn((reports, retentionDays, currentDate) => {
        const targetDate = new Date(currentDate.getTime() - retentionDays * 24 * 60 * 60 * 1000);
        const toDelete = reports.filter(report => {
          const createdAt = new Date(report.created_at);
          return createdAt < targetDate;
        });
        return toDelete;
      })
    };

    const allReports = [mockReportAtExactLimit, mockReportOverLimit];
    const deletionTargets = mockFileStorageAdapter.deleteExpiredReports(allReports, RETENTION_DAYS, now);

    expect(deletionTargets).toHaveLength(1);
    expect(deletionTargets[0].report_id).toBe('report-002');
    expect(deletionTargets[0].is_deleted).toBe(false);

    const shouldRemainReports = allReports.filter(
      report => !deletionTargets.some(target => target.report_id === report.report_id)
    );

    expect(shouldRemainReports).toHaveLength(1);
    expect(shouldRemainReports[0].report_id).toBe('report-001');
    expect(shouldRemainReports[0].is_deleted).toBe(false);

    const result = deleteExpiredReports({
      reports: allReports,
      retentionDays: RETENTION_DAYS,
      currentDate: now,
      fileStorageAdapter: mockFileStorageAdapter
    });

    expect(result.deletedCount).toBe(1);
    expect(result.retainedReports).toContainEqual(
      expect.objectContaining({
        report_id: 'report-001',
        is_deleted: false
      })
    );
    expect(result.retainedReports).not.toContainEqual(
      expect.objectContaining({
        report_id: 'report-002'
      })
    );
  });
});