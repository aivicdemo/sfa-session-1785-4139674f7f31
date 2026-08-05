import { calculateSuccessPatternMatchScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-398: [error] 成功パターンマトリクス適用判定機能 - 顧客データベース接続が失敗したときエラー応答が返される
  test('顧客データベース接続失敗時にDB_CONNECTION_ERRORエラーを返す', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const request_id = 'req-20240115-001';
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();

    fetchMock.mockRejectOnce(new Error('connection timeout'));

    const input = {
      customer_id: 'CUST-12345',
      industry_type: 'manufacturing',
      annual_revenue: 50000000,
      request_id: request_id,
      timestamp: timestamp,
    };

    let error_thrown = false;
    let error_response: any = null;

    try {
      await calculateSuccessPatternMatchScore(input);
    } catch (err: any) {
      error_thrown = true;
      error_response = err;
    }

    expect(error_thrown).toBe(true);
    expect(error_response).toBeDefined();
    expect(error_response.status).toBe(500);
    expect(error_response.error_code).toBe('DB_CONNECTION_ERROR');
    expect(error_response.error_message).toMatch(/顧客データベースへの接続に失敗/);
    expect(error_response.timestamp).toBeDefined();
    expect(error_response.request_id).toBe(request_id);
    expect(error_response.match_result).toBeUndefined();

    fetchMock.disableMocks();
  });
});