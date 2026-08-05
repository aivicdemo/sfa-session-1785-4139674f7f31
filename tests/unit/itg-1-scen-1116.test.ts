import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1116
  test('行動パターン分析結果データが存在しないとき、処理がエラーになること', async () => {
    const sales_rep_id = 'SR-20240115-001';
    const period_start = '2024-01-01';
    const period_end = '2024-01-31';

    fetchMock.mockResponseOnce(JSON.stringify(null), { status: 404 });

    let error_thrown = false;
    let error_code: string | null = null;
    let error_message: string | null = null;
    let http_status: number | null = null;

    try {
      await generateSalesRepBehaviorAnalysisReport({
        sales_rep_id,
        period_start,
        period_end,
      });
    } catch (err: unknown) {
      error_thrown = true;
      if (err instanceof Error) {
        error_message = err.message;
        if ('code' in err) {
          error_code = (err as { code: string }).code;
        }
        if ('status' in err) {
          http_status = (err as { status: number }).status;
        }
      }
    }

    expect(error_thrown).toBe(true);

    if (http_status === 404) {
      expect(error_message).toMatch(/指定された営業担当者の行動パターン分析結果データが見つかりません/);
    } else if (http_status === 400 || error_code === 'ERR_DATA_NOT_FOUND') {
      expect(error_code).toBe('ERR_DATA_NOT_FOUND');
      expect(error_message).toMatch(/分析対象データが存在しないため/);
    }

    expect(error_thrown).toBe(true);
    expect(error_message).toBeTruthy();
  });
});