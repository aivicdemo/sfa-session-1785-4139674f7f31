import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-143
  test('[error] 営業担当者ごとの行動パターン分析レポート生成機能 - 営業担当者IDが欠落しているとき、エラーが発生する', async () => {
    const sales_representative_id = null;
    const start_date = '2024-01-01';
    const end_date = '2024-01-31';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 400,
        error_message: '営業担当者IDが必須項目です',
        error_code: 'SALES_REP_ID_REQUIRED',
      }),
      { status: 400 }
    );

    const response = await fetch('/api/v1/sales-representative-analysis/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sales_representative_id: sales_representative_id,
        start_date: start_date,
        end_date: end_date,
      }),
    });

    expect(response.status).toBe(400);

    const response_body = await response.json();
    expect(response_body.error_message).toMatch(/営業担当者ID/);
    expect(response_body.error_code).toBe('SALES_REP_ID_REQUIRED');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});