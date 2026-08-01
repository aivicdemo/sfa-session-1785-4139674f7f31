import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-155
  test('商談記録の実行順序が標準プロセスの推奨順序と異なるとき、乖離が正常に検出される', () => {
    const sales_user_id = 'sales_user_001';
    const standard_process_steps = ['ステップ1', 'ステップ2', 'ステップ3', 'ステップ4'];
    const actual_execution_order = ['ステップ3', 'ステップ1', 'ステップ4', 'ステップ2'];
    const deal_id = 'deal_20240115_001';
    const analysis_period_days = 30;
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');

    const deal_records = [
      {
        deal_id: deal_id,
        step_name: 'ステップ3',
        executed_at: new Date('2024-01-15T10:00:00Z'),
        sequence_position: 1,
      },
      {
        deal_id: deal_id,
        step_name: 'ステップ1',
        executed_at: new Date('2024-01-15T10:30:00Z'),
        sequence_position: 2,
      },
      {
        deal_id: deal_id,
        step_name: 'ステップ4',
        executed_at: new Date('2024-01-15T11:00:00Z'),
        sequence_position: 3,
      },
      {
        deal_id: deal_id,
        step_name: 'ステップ2',
        executed_at: new Date('2024-01-15T11:30:00Z'),
        sequence_position: 4,
      },
    ];

    const report = generateSalesActivityAnalysisReport({
      sales_user_id: sales_user_id,
      standard_process_steps: standard_process_steps,
      deal_records: deal_records,
      analysis_period_days: analysis_period_days,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
    });

    expect(report).toBeDefined();
    expect(report.execution_sequence_deviation_analysis).toBeDefined();
    
    const deviation_analysis = report.execution_sequence_deviation_analysis;
    expect(deviation_analysis.recommended_order).toEqual(standard_process_steps);
    expect(deviation_analysis.actual_execution_order).toEqual(actual_execution_order);
    
    expect(deviation_analysis.deviation_score).toBe(68);
    
    expect(deviation_analysis.deviation_details).toBeDefined();
    expect(Array.isArray(deviation_analysis.deviation_details)).toBe(true);
    expect(deviation_analysis.deviation_details.length).toBeGreaterThan(0);
    
    const deviation_messages = deviation_analysis.deviation_details.map(
      (detail: { issue: string }) => detail.issue
    );
    expect(deviation_messages).toContain('ステップ3の前倒し実行');
    expect(deviation_messages).toContain('ステップ1の順序逆転');
    expect(deviation_messages).toContain('ステップ4の前倒し実行');
    
    expect(report.analysis_period).toEqual({
      start_date: analysis_start_date,
      end_date: analysis_end_date,
      days: analysis_period_days,
    });
    
    expect(report.sales_user_id).toBe(sales_user_id);
  });
});