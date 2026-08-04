import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 期限切れレポート削除', () => {
  // SCEN-313
  test('削除対象の期限切れレポートが0件のとき、削除処理は実行されるが削除対象がない', async () => {
    // Arrange: FileStorageAdapterのスタブを作成
    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 0,
        status: 'completed'
      })
    };

    // 削除対象レポートが0件のシミュレーション
    const reportMetadataTable: Array<{
      reportId: string;
      createdAt: Date;
      expiresAt: Date;
    }> = [];

    // Act: deleteExpiredReports関数を実行
    const jobExecutionLog: {
      startTime: Date;
      deletedReportsCount: number;
      status: string;
      completionMessage: string;
      endTime: Date;
    } = {
      startTime: new Date('2024-01-15T10:00:00Z'),
      deletedReportsCount: 0,
      status: 'completed',
      completionMessage: '削除対象レポート: 0件、削除処理完了',
      endTime: new Date('2024-01-15T10:00:05Z')
    };

    const result = await deleteExpiredReports(mockFileStorageAdapter, reportMetadataTable);

    // Assert: 削除処理が呼び出されたことを検証
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalled();

    // レポートメタデータテーブルのレコード件数が0件のままであることを検証
    expect(reportMetadataTable.length).toBe(0);

    // 削除対象レポート件数が0件であることを検証
    expect(result.deletedReportsCount).toBe(0);

    // ジョブ実行ステータスが正常完了であることを検証
    expect(result.status).toBe('completed');

    // ジョブ実行ログに正常終了メッセージが記録されていることを検証
    expect(result.completionMessage).toBe('削除対象レポート: 0件、削除処理完了');

    // エラーが発生していないことを検証
    expect(result.error).toBeUndefined();
  });
});