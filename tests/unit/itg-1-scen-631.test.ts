import { generateSalesPersonActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-631
  test('乖離度が±15%以内の場合、改善優先度が「中」に判定される', () => {
    const target_sales = 10000000; // 月間売上目標1,000万円

    // ケース1: 乖離度-2.5%（目標値の97.5%）
    const actual_sales_case1 = 9750000;
    const report_case1 = generateSalesPersonActionPatternAnalysisReport({
      sales_person_id: 'SP001',
      target_sales: target_sales,
      actual_sales: actual_sales_case1,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    });

    expect(report_case1.improvement_priority).toBe('中');

    // ケース2: 乖離度0%（目標値の100%）
    const actual_sales_case2 = 10000000;
    const report_case2 = generateSalesPersonActionPatternAnalysisReport({
      sales_person_id: 'SP002',
      target_sales: target_sales,
      actual_sales: actual_sales_case2,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    });

    expect(report_case2.improvement_priority).toBe('中');

    // ケース3: 乖離度+2.5%（目標値の102.5%）
    const actual_sales_case3 = 10250000;
    const report_case3 = generateSalesPersonActionPatternAnalysisReport({
      sales_person_id: 'SP003',
      target_sales: target_sales,
      actual_sales: actual_sales_case3,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    });

    expect(report_case3.improvement_priority).toBe('中');
  });
});