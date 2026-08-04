import { deleteExpiredReports } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - レポート生成・保存機能', () => {
  // SCEN-2351: [edge] 推奨内容のレポート生成・保存機能 - 期限切れレポートがS3から自動削除される
  test('should delete expired reports older than 30 days and retain recent ones', async () => {
    const now = new Date('2024-02-10T00:00:00Z');
    const report_expired_1 = new Date('2024-01-01T00:00:00Z');
    const report_expired_2 = new Date('2024-01-05T00:00:00Z');
    const report_expired_3 = new Date('2024-01-10T00:00:00Z');
    const report_recent_1 = new Date('2024-01-26T00:00:00Z');
    const report_recent_2 = new Date('2024-01-21T00:00:00Z');

    const expired_key_1 = 'reports/report_2024-01-01_001.pdf';
    const expired_key_2 = 'reports/report_2024-01-05_002.pdf';
    const expired_key_3 = 'reports/report_2024-01-10_003.pdf';
    const recent_key_1 = 'reports/report_2024-01-26_004.pdf';
    const recent_key_2 = 'reports/report_2024-01-21_005.pdf';

    const reportMetadata = [
      {
        report_id: '001',
        object_key: expired_key_1,
        generated_at: report_expired_1.toISOString(),
        file_size_bytes: 1024,
        created_timestamp: report_expired_1.toISOString(),
      },
      {
        report_id: '002',
        object_key: expired_key_2,
        generated_at: report_expired_2.toISOString(),
        file_size_bytes: 2048,
        created_timestamp: report_expired_2.toISOString(),
      },
      {
        report_id: '003',
        object_key: expired_key_3,
        generated_at: report_expired_3.toISOString(),
        file_size_bytes: 1536,
        created_timestamp: report_expired_3.toISOString(),
      },
      {
        report_id: '004',
        object_key: recent_key_1,
        generated_at: report_recent_1.toISOString(),
        file_size_bytes: 3072,
        created_timestamp: report_recent_1.toISOString(),
      },
      {
        report_id: '005',
        object_key: recent_key_2,
        generated_at: report_recent_2.toISOString(),
        file_size_bytes: 2560,
        created_timestamp: report_recent_2.toISOString(),
      },
    ];

    const deleted_keys: string[] = [];

    const fileStorageAdapterStub = {
      deleteExpiredReports: jest.fn(async (metadata: any[], cutoff_date: Date) => {
        for (const report of metadata) {
          const generated_date = new Date(report.generated_at);
          const days_diff = Math.floor((cutoff_date.getTime() - generated_date.getTime()) / (1000 * 60 * 60 * 24));
          if (days_diff >= 30) {
            deleted_keys.push(report.object_key);
          }
        }
        return deleted_keys.length;
      }),
      deleteObject: jest.fn(async (key: string) => {
        return { success: true };
      }),
    };

    const cutoff_date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    await deleteExpiredReports(reportMetadata, cutoff_date, fileStorageAdapterStub);

    expect(fileStorageAdapterStub.deleteExpiredReports).toHaveBeenCalledWith(reportMetadata, cutoff_date);

    expect(deleted_keys).toHaveLength(3);
    expect(deleted_keys).toContain(expired_key_1);
    expect(deleted_keys).toContain(expired_key_2);
    expect(deleted_keys).toContain(expired_key_3);
    expect(deleted_keys).not.toContain(recent_key_1);
    expect(deleted_keys).not.toContain(recent_key_2);

    const remaining_records = reportMetadata.filter(
      (report) => {
        const generated_date = new Date(report.generated_at);
        const days_diff = Math.floor((cutoff_date.getTime() - generated_date.getTime()) / (1000 * 60 * 60 * 24));
        return days_diff < 30;
      }
    );

    expect(remaining_records).toHaveLength(2);
    expect(remaining_records.map((r) => r.object_key)).toEqual([recent_key_1, recent_key_2]);
  });
});