import { describe, test, expect } from '@jest/globals';
import { generateSalesRepActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-165: 営業管理職のモニタリング体制が未整備のとき、エラーが発生する', () => {
    const sales_rep_id = 'SR-001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const manager_id = null;

    const input = {
      sales_rep_id,
      analysis_period_start,
      analysis_period_end,
      manager_id,
    };

    expect(() =>
      generateSalesRepActionPatternAnalysisReport(input)
    ).toThrow(/MONITORING_SETUP_INCOMPLETE/);
  });
});