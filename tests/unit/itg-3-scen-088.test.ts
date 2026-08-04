import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-088
  test('期限切れレポート削除機能 - 削除対象レポートが0件の場合に処理が正常に完了する', async () => {
    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 0,
        deletedFileNames: [],
        timestamp: new Date('2024-01-15T11:00:00Z'),
      }),
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
    };

    const errorLogs: string[] = [];
    const originalError = console.error;
    console.error = jest.fn((message: string) => {
      errorLogs.push(message);
    });

    const result = await deleteExpiredReports(mockFileStorageAdapter);

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(result.deletedCount).toBe(0);
    expect(result.deletedFileNames).toEqual([]);
    expect(result.timestamp).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(errorLogs.length).toBe(0);

    console.error = originalError;
  });
});