import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-708
  test('レポート生成に必要な集計データベースへの接続に失敗したとき処理がエラーになる', async () => {
    const employeeId = 'EMP001';
    const dbConnectionError = new Error('集計データベースへの接続に失敗しました');
    dbConnectionError.name = 'DB_CONNECTION_ERROR';

    const mockDatabaseConnection = {
      connect: jest.fn().mockRejectedValue(dbConnectionError),
      disconnect: jest.fn(),
    };

    const mockOptions = {
      database: mockDatabaseConnection,
    };

    await expect(
      generateSalesPersonBehaviorAnalysisReport(employeeId, mockOptions)
    ).rejects.toThrow(/集計データベースへの接続に失敗しました/);
  });
});