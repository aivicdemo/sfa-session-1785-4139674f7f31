import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-455
  test('営業活動ログが0件の営業担当者について、行動パターン分析結果が0件として処理される', () => {
    const sales_user_id = 'sales_user_001';
    const activity_logs: unknown[] = [];
    const analysis_target_count = 0;
    const analysis_result_count = 0;
    const error_flag = false;

    const report = generateSalesPersonBehaviorAnalysisReport({
      sales_person_id: sales_user_id,
      activity_logs: activity_logs,
    });

    expect(report.analysis_results).toEqual([]);
    expect(report.analysis_target_record_count).toBe(analysis_target_count);
    expect(report.analysis_result_count).toBe(analysis_result_count);
    expect(report.has_error).toBe(error_flag);
  });
});