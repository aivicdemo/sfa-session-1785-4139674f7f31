import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1004
  test('期限切レポート自動削除機能 - 期限切判定用の保持期間が負数のとき、不正値エラーが返される', () => {
    const fileStorageAdapterStub = {
      deleteExpiredReports: jest.fn(),
    };

    const result = deleteExpiredReports(
      {
        retentionDays: -1,
      },
      fileStorageAdapterStub
    );

    expect(result).toEqual({
      errorCode: 'INVALID_RETENTION_DAYS',
      message: '保持期間は0以上の整数で指定してください',
      success: false,
    });

    expect(fileStorageAdapterStub.deleteExpiredReports).not.toHaveBeenCalled();
  });
});