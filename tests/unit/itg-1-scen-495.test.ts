import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-495: [error] 営業プロセス実行状況テーブルが欠落している場合、エラーを返す
  test('営業プロセス実行状況テーブルが null を返すとき、TABLE_MISSING エラーを返す', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    
    try {
      fetchMock.resetMocks();

      // 営業プロセス実行状況テーブルが null を返すようにスタブ化
      fetchMock.mockResponseOnce(JSON.stringify(null), { status: 200 });

      // ダッシュボード初期化処理をシミュレート
      const response = await fetch('/api/sales-process-execution-status');
      const data = await response.json();

      // logic モジュールからエラーハンドリング関数をインポート
      const { validateProcessExecutionTable } = await import('../../src/logic/it-1');

      // エラーが発生することを検証
      const result = validateProcessExecutionTable(data);

      // エラーコードが TABLE_MISSING であることを検証
      expect(result).toEqual({
        isValid: false,
        errorCode: 'TABLE_MISSING',
        errorMessage: '営業プロセス実行状況テーブルが見つかりません'
      });
    } finally {
      fetchMock.disableMocks();
    }
  });
});