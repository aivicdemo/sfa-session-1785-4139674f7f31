import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesProcessAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  test('SCEN-1111: 標準プロセス定義IDが空文字列のとき、処理がエラーになること', () => {
    // 標準プロセス定義IDが空文字列の場合のエラーテスト
    const sales_staff_id = 'STAFF_001';
    const standard_process_id = '';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';
    const contract_results_data = [
      {
        id: 'DEAL_001',
        sales_staff_id: 'STAFF_001',
        contract_date: '2024-01-15',
        contract_status: 'won'
      }
    ];

    expect(() =>
      generateSalesProcessAnalysisReport({
        sales_staff_id,
        standard_process_id,
        analysis_start_date,
        analysis_end_date,
        contract_results_data
      })
    ).toThrow(/標準プロセス定義ID/);
  });
});