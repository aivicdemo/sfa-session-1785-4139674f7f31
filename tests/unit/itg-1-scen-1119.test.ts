import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1119
  test('乖離度の計算に必要な実績ステップ数が0のとき、処理がエラーになること', () => {
    const sales_rep_id = 'SR_001';
    const analysis_start_date = new Date('2024-01-01');
    const analysis_end_date = new Date('2024-01-31');
    const actual_step_count = 0;

    const input = {
      sales_rep_id,
      analysis_start_date,
      analysis_end_date,
      actual_step_count,
    };

    expect(() =>
      generateSalesActivityPatternAnalysisReport(input)
    ).toThrow(/実績ステップ数が0|INVALID_STEP_COUNT/);
  });
});