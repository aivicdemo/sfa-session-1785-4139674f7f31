import { generateActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-330
  test('[normal] 行動パターン分析結果が1件の場合、レポートが正常に生成される', () => {
    const employeeId = 'EMP-001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';
    const reportGeneratedAt = '2024-01-31T15:00:00Z';

    const mockAnalysisData = [
      {
        employee_id: 'EMP-001',
        activity_type: '訪問',
        activity_datetime: '2024-01-15T10:30:00Z',
        customer_id: 'CUST-123',
        proposal_count: 1,
        contract_count: 0,
        visit_count: 1,
      },
    ];

    const result = generateActionPatternAnalysisReport({
      employee_id: employeeId,
      analysis_start_date: analysisStartDate,
      analysis_end_date: analysisEndDate,
      action_pattern_data: mockAnalysisData,
      report_generated_at: reportGeneratedAt,
    });

    expect(result.report_status).toBe('completed');
    expect(result.employee_id).toBe('EMP-001');
    expect(result.analysis_period_start).toBe('2024/01/01');
    expect(result.analysis_period_end).toBe('2024/01/31');
    expect(result.analysis_results.length).toBe(1);

    const firstResult = result.analysis_results[0];
    expect(firstResult.activity_type).toBe('訪問');
    expect(firstResult.activity_datetime).toBe('2024-01-15 10:30');
    expect(firstResult.customer_id).toBe('CUST-123');

    expect(result.report_generated_datetime).toBe('2024-01-31T15:00:00Z');
  });
});