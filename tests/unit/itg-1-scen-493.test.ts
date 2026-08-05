import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-493
  test('ダッシュボード設定が存在しない場合、エラーを返す', async () => {
    const user_id = 'user_12345';
    const dashboard_config_url = `https://api.example.com/dashboard-config/${user_id}`;

    fetchMock.mockResponseOnce(null, { status: 404 });

    const { loadAuditDashboard } = await import('../../src/logic/it-1');

    const result = await loadAuditDashboard({ user_id });

    expect(result).toEqual({
      success: false,
      error_code: 'DASHBOARD_CONFIG_NOT_FOUND',
      error_message: 'ダッシュボード設定が見つかりません'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      dashboard_config_url,
      expect.objectContaining({
        method: 'GET'
      })
    );
  });
});