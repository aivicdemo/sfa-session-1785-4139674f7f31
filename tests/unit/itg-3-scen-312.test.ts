import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 期限切れレポート自動削除', () => {
  // SCEN-312
  test('Amazon S3削除失敗時に期限切れレポートが残存し削除フラグが更新されないこと', async () => {
    const expiredReportIds = ['REP-001', 'REP-002', 'REP-003'];
    const now = new Date('2026-01-15T10:00:00Z');
    const thirtyDaysAgo = new Date('2025-12-16T10:00:00Z');

    const mockReportMetadata = [
      {
        report_id: 'REP-001',
        file_name: 'recommendation_report_001.pdf',
        s3_object_key: 's3://bucket/reports/REP-001.pdf',
        created_at: new Date('2025-11-15T10:00:00Z'),
        expiration_date: thirtyDaysAgo,
        deleted_flag: false,
        deletion_attempted_at: null,
      },
      {
        report_id: 'REP-002',
        file_name: 'recommendation_report_002.pdf',
        s3_object_key: 's3://bucket/reports/REP-002.pdf',
        created_at: new Date('2025-11-10T10:00:00Z'),
        expiration_date: new Date('2025-12-10T10:00:00Z'),
        deleted_flag: false,
        deletion_attempted_at: null,
      },
      {
        report_id: 'REP-003',
        file_name: 'recommendation_report_003.pdf',
        s3_object_key: 's3://bucket/reports/REP-003.pdf',
        created_at: new Date('2025-11-05T10:00:00Z'),
        expiration_date: new Date('2025-12-05T10:00:00Z'),
        deleted_flag: false,
        deletion_attempted_at: null,
      },
    ];

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockRejectedValueOnce(
        new Error('AccessDenied: User is not authorized to perform: s3:DeleteObject')
      ),
    };

    const result = await deleteExpiredReports(
      mockReportMetadata,
      mockFileStorageAdapter,
      now
    );

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ report_id: 'REP-001' }),
        expect.objectContaining({ report_id: 'REP-002' }),
        expect.objectContaining({ report_id: 'REP-003' }),
      ])
    );

    expect(result.successfully_deleted_count).toBe(0);
    expect(result.deletion_failed_count).toBe(3);
    expect(result.failed_report_ids).toEqual(
      expect.arrayContaining(['REP-001', 'REP-002', 'REP-003'])
    );
    expect(result.error_message).toMatch(/AccessDenied/);

    expect(result.remaining_reports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          report_id: 'REP-001',
          deleted_flag: false,
          deletion_attempted_at: null,
        }),
        expect.objectContaining({
          report_id: 'REP-002',
          deleted_flag: false,
          deletion_attempted_at: null,
        }),
        expect.objectContaining({
          report_id: 'REP-003',
          deleted_flag: false,
          deletion_attempted_at: null,
        }),
      ])
    );

    expect(result.remaining_reports.length).toBe(3);
    expect(result.remaining_reports.every((r) => r.deleted_flag === false)).toBe(true);
    expect(
      result.remaining_reports.every((r) => r.deletion_attempted_at === null)
    ).toBe(true);
  });
});