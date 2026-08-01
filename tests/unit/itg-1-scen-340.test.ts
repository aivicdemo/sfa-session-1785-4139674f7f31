import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-340
  test('[edge] 営業活動の成約率が0%の場合、レポートに正常に反映される', () => {
    const sales_rep_id = 'SR-001';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';
    const proposal_count = 10;
    const contract_count = 0;

    const result = generateSalesActivityAnalysisReport({
      sales_rep_id: sales_rep_id,
      analysis_period_start: analysis_start_date,
      analysis_period_end: analysis_end_date,
      proposal_count: proposal_count,
      contract_count: contract_count,
    });

    expect(result.status).toBe('生成成功');
    expect(result.conversion_rate).toBe(0);
    expect(result.details.sales_activity_indicators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric_name: '成約率',
          metric_value: '0%',
        }),
        expect.objectContaining({
          metric_name: '成約件数',
          metric_value: '0件/10件',
        }),
      ])
    );
    expect(result.error_message).toBeNull();
  });
});