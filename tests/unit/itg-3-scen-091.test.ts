import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 期限切れレポート削除', () => {
  test('SCEN-091: 有効期限がちょうど切れたレポートが正常に削除される', async () => {
    // Arrange
    const now = new Date('2024-12-15T10:00:00Z');
    const createdAt = new Date('2024-11-15T10:00:00Z'); // 30日前
    const expiresAt = now; // 有効期限が現在時刻と完全に一致

    const mockReportRecord = {
      report_id: 'RPT-001',
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'active',
      s3_object_key: 'reports/rpt-001.pdf'
    };

    const mockDatabase = {
      query: jest.fn(),
      execute: jest.fn()
    };

    const mockFileStorageAdapter = {
      deleteObject: jest.fn().mockResolvedValue({
        statusCode: 204,
        body: ''
      })
    };

    // Mock database query to return expiredReport
    mockDatabase.query.mockResolvedValueOnce([mockReportRecord]);

    // Mock database delete execution
    mockDatabase.execute.mockResolvedValueOnce({
      rowCount: 1
    });

    // Act
    const result = await deleteExpiredReports(
      mockDatabase,
      mockFileStorageAdapter,
      now
    );

    // Assert
    // 1. バッチ処理が正常終了ステータスを返すことを確認
    expect(result.exitCode).toBe(0);

    // 2. データベースクエリが有効期限切れレポートを取得したことを確認
    expect(mockDatabase.query).toHaveBeenCalledWith(
      expect.stringContaining('expires_at'),
      expect.any(Array)
    );

    // 3. FileStorageAdapterのモックに対してS3オブジェクトキー削除呼び出しが1回正確に記録されたことを確認
    expect(mockFileStorageAdapter.deleteObject).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteObject).toHaveBeenCalledWith(
      'reports/rpt-001.pdf'
    );

    // 4. データベースから物理削除が実行されたことを確認
    expect(mockDatabase.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
      expect.arrayContaining(['RPT-001'])
    );

    // 5. 処理結果にレポート削除数が含まれることを確認
    expect(result.deletedReportsCount).toBe(1);
    expect(result.deletedReports).toEqual([mockReportRecord]);
  });
});