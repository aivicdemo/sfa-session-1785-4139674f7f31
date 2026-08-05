import { generateHealthCheckReport } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-311
  test('[normal] システムヘルスチェック判定機能 - システム稼働状況が合格で営業データ品質が合格の組み合わせでレポート生成される', () => {
    const system_health_check_result = {
      status: 'PASS',
      timestamp: '2024-01-15T11:00:00Z',
      uptime_percentage: 99.8,
      error_rate: 0.2,
    };

    const sales_data_quality_check_result = {
      status: 'PASS',
      timestamp: '2024-01-15T11:00:00Z',
      quality_score: 98,
      issue_count: 2,
    };

    const report = generateHealthCheckReport(
      system_health_check_result,
      sales_data_quality_check_result
    );

    expect(report.overall_judgment).toBe('PASS');
    expect(report.system_status_judgment).toBe('PASS');
    expect(report.sales_data_quality_judgment).toBe('PASS');
    expect(typeof report.judgment_timestamp).toBe('string');
    expect(report.judgment_timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});