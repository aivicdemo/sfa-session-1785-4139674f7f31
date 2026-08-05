import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  let mockLogs: Array<{ level: string; eventType: string; message: string }>;

  beforeEach(() => {
    mockLogs = [];
    // Mock システムログ記録
    (global as any).recordSystemLog = (log: { level: string; eventType: string; message: string }) => {
      mockLogs.push(log);
    };
  });

  afterEach(() => {
    delete (global as any).recordSystemLog;
  });

  // SCEN-150
  test('指定営業担当者が存在しないときレポート生成が失敗する', async () => {
    const non_existent_sales_rep_id = 'nonexistent-sales-rep-999';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';

    const error_response = await generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: non_existent_sales_rep_id,
      period_start: analysis_start_date,
      period_end: analysis_end_date,
    });

    expect(error_response.status_code).toBe(404);
    expect(error_response.error_code).toBe('SALES_REP_NOT_FOUND');
    expect(error_response.message).toBe('指定された営業担当者が見つかりません');
    expect(error_response.details.sales_rep_id).toBe(non_existent_sales_rep_id);
    expect(error_response.report_generated).toBe(false);

    expect(mockLogs).toHaveLength(1);
    expect(mockLogs[0].level).toBe('ERROR');
    expect(mockLogs[0].eventType).toBe('REPORT_GENERATION_FAILED');
    expect(mockLogs[0].message).toContain(non_existent_sales_rep_id);
  });
});