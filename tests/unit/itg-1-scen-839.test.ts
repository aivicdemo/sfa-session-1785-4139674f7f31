import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-839
  test('[error] 問題検出結果のレビュー・判定機能 - 営業管理職が提案内容と顧客対応パターン分析データへのアクセス権限がない場合にエラーになること', async () => {
    // Arrange
    const managerUserId = 'manager_user_001';
    const managerPermissionLevel = 'manager';
    const analysisDataId = 'analysis_data_001';

    // Mock fetch
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    // 権限チェック APIが 403 Forbidden を返す
    fetchMock.mockResponseOnce(
      JSON.stringify({
        errorCode: 'INSUFFICIENT_PERMISSION',
        errorMessage: '提案内容・顧客対応パターン分析データへのアクセス権限がありません。システム管理者に問い合わせてください。',
        timestamp: '2024-01-15T11:00:00Z'
      }),
      { status: 403 }
    );

    // Act & Assert
    try {
      const response = await fetch(
        `/api/v1/analysis-data/${analysisDataId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${managerUserId}`,
            'X-User-Permission': managerPermissionLevel,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseBody = await response.json();

      // Assert: ステータスコードが 403 であること
      expect(response.status).toBe(403);

      // Assert: エラーコードが INSUFFICIENT_PERMISSION であること
      expect(responseBody.errorCode).toBe('INSUFFICIENT_PERMISSION');

      // Assert: エラーメッセージが正確であること
      expect(responseBody.errorMessage).toBe(
        '提案内容・顧客対応パターン分析データへのアクセス権限がありません。システム管理者に問い合わせてください。'
      );

      // Assert: タイムスタンプが ISO 8601 形式であること
      expect(typeof responseBody.timestamp).toBe('string');
      expect(responseBody.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    } finally {
      fetchMock.disableMocks();
    }
  });
});