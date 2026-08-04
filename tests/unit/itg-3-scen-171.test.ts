import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-171: [edge] 期限切れレポート自動削除機能 - 保持期限ちょうどのレポートが削除対象として判定される
  test('should delete report with creation date exactly at retention limit boundary', async () => {
    const now = new Date('2024-08-01T12:00:00Z');
    const retentionDays = 30;
    const reportCreatedAtExactBoundary = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);

    const reportMetadataBeforeDeletion = {
      reportId: 'report-edge-001',
      fileName: 'report_2024-07-02.pdf',
      createdAt: reportCreatedAtExactBoundary,
      filePath: 's3://bucket/reports/report_2024-07-02.pdf',
      fileSize: 512000,
    };

    const mockReportRepository = {
      findExpiredReports: jest.fn().mockResolvedValue([reportMetadataBeforeDeletion]),
      deleteReportMetadata: jest.fn().mockResolvedValue(true),
      queryByReportId: jest.fn().mockResolvedValue(null),
    };

    const s3DeleteCallLog: Array<{ filePath: string; timestamp: Date }> = [];
    const mockFileStorageAdapter = {
      deleteFile: jest.fn(async (filePath: string) => {
        s3DeleteCallLog.push({ filePath, timestamp: new Date() });
        return { success: true, deletedPath: filePath };
      }),
    };

    await deleteExpiredReports(
      mockReportRepository,
      mockFileStorageAdapter,
      now,
      retentionDays
    );

    expect(mockReportRepository.findExpiredReports).toHaveBeenCalledWith(
      reportCreatedAtExactBoundary
    );
    expect(mockReportRepository.deleteReportMetadata).toHaveBeenCalledWith(
      'report-edge-001'
    );
    expect(mockFileStorageAdapter.deleteFile).toHaveBeenCalledWith(
      's3://bucket/reports/report_2024-07-02.pdf'
    );
    expect(s3DeleteCallLog).toHaveLength(1);
    expect(s3DeleteCallLog[0].filePath).toBe('s3://bucket/reports/report_2024-07-02.pdf');
    expect(await mockReportRepository.queryByReportId('report-edge-001')).toBeNull();
  });
});