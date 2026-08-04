import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ファイルストレージ連携', () => {
  // SCEN-817
  test('[normal] ファイルストレージ連携（正常系） - 期限切れレポートが自動削除される', async () => {
    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn(async (fileKeys: string[]) => {
        return { deletedCount: fileKeys.length };
      }),
    };

    const reportMetadata = [
      {
        file_key: 'report_old_001.pdf',
        created_at: new Date('2023-10-15T10:00:00Z'),
      },
      {
        file_key: 'report_old_002.xlsx',
        created_at: new Date('2023-10-20T14:30:00Z'),
      },
      {
        file_key: 'report_recent_001.pdf',
        created_at: new Date('2024-01-10T09:15:00Z'),
      },
    ];

    const currentDate = new Date('2024-01-15T11:00:00Z');
    const lifecycleThresholdDays = 90;
    const expiredReportKeys: string[] = [];

    for (const report of reportMetadata) {
      const daysDiff = Math.floor(
        (currentDate.getTime() - report.created_at.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff >= lifecycleThresholdDays) {
        expiredReportKeys.push(report.file_key);
      }
    }

    const result = await deleteExpiredReports(
      mockFileStorageAdapter,
      reportMetadata,
      currentDate
    );

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalled();
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith(
      expect.arrayContaining(['report_old_001.pdf', 'report_old_002.xlsx'])
    );

    const callArgs = mockFileStorageAdapter.deleteExpiredReports.mock.calls[0][0];
    expect(callArgs).toHaveLength(2);
    expect(callArgs).toEqual(
      expect.arrayContaining(['report_old_001.pdf', 'report_old_002.xlsx'])
    );
    expect(callArgs).not.toContain('report_recent_001.pdf');

    const remainingMetadata = reportMetadata.filter(
      (report) =>
        !expiredReportKeys.includes(report.file_key)
    );
    expect(remainingMetadata).toHaveLength(1);
    expect(remainingMetadata[0].file_key).toBe('report_recent_001.pdf');

    const deletedMetadata = reportMetadata.filter((report) =>
      expiredReportKeys.includes(report.file_key)
    );
    expect(deletedMetadata).toHaveLength(2);
    expect(deletedMetadata.map((r) => r.file_key)).toEqual(
      expect.arrayContaining(['report_old_001.pdf', 'report_old_002.xlsx'])
    );

    expect(result).toEqual({
      deletedCount: 2,
      remainingCount: 1,
    });
  });
});