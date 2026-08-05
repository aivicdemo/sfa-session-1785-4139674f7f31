import { initializeAuditDashboard } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-574: 営業プロセス定義が欠落している場合、エラーになる', async () => {
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const result = await initializeAuditDashboard();

    expect(result).toEqual({
      code: 'PROCESS_DEFINITION_NOT_FOUND',
      message: '営業プロセス定義が見つかりません',
    });
  });
});