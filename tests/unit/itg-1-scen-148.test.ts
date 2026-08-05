import { generateActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  test('SCEN-148: 営業活動ログが空（null）のときレポート生成が失敗する', () => {
    // Arrange
    const input_activity_logs = null;
    const input_sales_staff_id = 'staff_001';
    const input_analysis_period_start = '2024-01-01';
    const input_analysis_period_end = '2024-01-31';

    // Act
    const result = generateActivityPatternAnalysisReport({
      activity_logs: input_activity_logs,
      sales_staff_id: input_sales_staff_id,
      analysis_period_start: input_analysis_period_start,
      analysis_period_end: input_analysis_period_end,
    });

    // Assert
    expect(result.error_code).toBe('ACTIVITY_LOG_EMPTY');
    expect(result.error_message).toBe('営業活動ログが存在しません');
    expect(result.http_status_code).toBe(400);
    expect(result.report_data).toBeNull();
  });
});