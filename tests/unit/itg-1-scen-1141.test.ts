import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1141
  test('分析対象期間の終了日が空のとき、処理がエラーになること', async () => {
    const start_date = '2024-01-01';
    const end_date = '';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'endDate is required',
      }),
      { status: 400 }
    );

    const response = await fetch('/api/analysis/behavior-pattern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_date,
        end_date,
      }),
    });

    expect(response.status).toBe(400);

    const response_body = await response.json();
    expect(response_body.error).toMatch(/endDate is required/);
  });
});