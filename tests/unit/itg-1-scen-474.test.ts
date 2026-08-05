import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-474
  test('営業プロセス定義が欠落している場合、エラーを返す', async () => {
    const sales_rep_id = 'sales_user_001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    const result = await generateSalesRepBehaviorAnalysisReport({
      sales_rep_id,
      analysis_period_start,
      analysis_period_end,
      process_definition_id: null,
      sales_activities: [],
      deal_results: []
    });

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('code', 'PROCESS_DEFINITION_NOT_FOUND');
    expect(result.error.message).toMatch(/営業プロセス定義が見つかりません/);
    expect(result.error).toHaveProperty('status_code', 400);
    expect(result).not.toHaveProperty('report_id');
    expect(result).not.toHaveProperty('data');
  });
});