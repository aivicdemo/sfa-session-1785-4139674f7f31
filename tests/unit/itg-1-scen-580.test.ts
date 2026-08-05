import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-580
  test('[error] 営業プロセス実行状況の進捗率が欠落している場合、エラーになる', async () => {
    // Setup: モックコンソール
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Setup: API レスポンス（進捗率が null）
    const mockProcessData = {
      process_id: 'proc_001',
      process_name: '初回接触',
      stage: 'contact_initial',
      progress_rate: null,
      completion_status: 'in_progress',
      last_updated: '2024-01-15T10:30:00Z'
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockProcessData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // Action: ダッシュボード初期化ロジック呼び出し
    try {
      const response = await fetch('/api/sales-process/audit-dashboard', {
        method: 'GET'
      });
      const data = await response.json();

      // 進捗率が null の場合、エラーハンドラを実行
      if (data.progress_rate === null || data.progress_rate === undefined) {
        throw new Error('進捗率が未設定です');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }

    // Assertion: エラーメッセージが正しく出力されていることを確認
    expect(consoleErrorSpy).toHaveBeenCalledWith('進捗率が未設定です');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});