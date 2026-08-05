import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { selectSalesActivityAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析指標自動選定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1071
  test('営業活動ログが存在しない場合にエラーが発生する', () => {
    const empty_sales_activity_logs: never[] = [];

    expect(() => {
      selectSalesActivityAnalysisMetrics({
        sales_activity_logs: empty_sales_activity_logs,
        process_definition: {
          process_id: 'PROC_001',
          process_name: '標準営業プロセス',
          stages: [
            {
              stage_id: 'STAGE_01',
              stage_name: '初回接触',
              required_indicators: ['contact_frequency'],
            },
            {
              stage_id: 'STAGE_02',
              stage_name: '提案',
              required_indicators: ['proposal_success_rate'],
            },
            {
              stage_id: 'STAGE_03',
              stage_name: '交渉',
              required_indicators: ['negotiation_duration'],
            },
            {
              stage_id: 'STAGE_04',
              stage_name: '成約',
              required_indicators: ['closing_rate'],
            },
          ],
        },
        sales_results: [
          {
            result_id: 'RES_001',
            contract_amount: 5000000,
            contract_date: new Date('2024-01-15'),
          },
        ],
      });
    }).toThrow(/NO_SALES_ACTIVITY_LOG_FOUND/);
  });
});