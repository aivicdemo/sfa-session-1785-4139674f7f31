import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('AIエージェント推奨根拠の可視化機能 - FileStorageAdapter deleteExpiredReports', () => {
  // SCEN-1003
  it('期限切レポート自動削除機能 - deleteExpiredReports が API エラーを返すとき、エラーログが記録される', async () => {
    // Arrange
    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const mockS3Api = {
      deleteExpiredReports: jest.fn().mockRejectedValueOnce({
        statusCode: 403,
        message: 'S3 API呼び出し失敗',
        code: 'Forbidden',
      }),
    };

    const { deleteExpiredReportsByAdapter } = await import('../../src/logic/it-1-br-3-1-1-1');

    // Act
    let caughtError: any;
    try {
      await deleteExpiredReportsByAdapter(mockS3Api, mockLogger);
    } catch (error) {
      caughtError = error;
    }

    // Assert
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    
    const errorCall = mockLogger.error.mock.calls[0];
    const errorMessage = errorCall[0];
    
    expect(errorMessage).toMatch(/FileStorageAdapter\.deleteExpiredReports/);
    expect(errorMessage).toMatch(/403/);
    expect(errorMessage).toMatch(/S3 API呼び出し失敗/);

    expect(caughtError).toBeDefined();
    expect(caughtError.statusCode).toBe(403);
    expect(caughtError.code).toBe('Forbidden');
  });
});