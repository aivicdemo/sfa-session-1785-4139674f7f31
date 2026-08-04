import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 期限切レポート自動削除', () => {
  let mockFileStorageAdapter: any;

  beforeEach(() => {
    mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue([]),
    };
  });

  // SCEN-1001
  test('期限切レポート自動削除機能 - レポートメタデータ一覧が空配列のとき、削除対象なしで正常終了する', async () => {
    mockFileStorageAdapter.deleteExpiredReports.mockResolvedValue([]);

    const result = await deleteExpiredReports(mockFileStorageAdapter);

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      deletedCount: 0,
      deletedReports: [],
      status: 'success',
    });
  });
});