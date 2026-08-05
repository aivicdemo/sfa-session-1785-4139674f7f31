import { generateHealthCheckResultReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-366: システムヘルスチェック結果レポート生成機能 - 業務上の最大規模の営業案件数でチェックが実行される場合にレポート生成が完了する', async () => {
    // テスト対象システムを初期化し、モックデータベースに業務上の最大規模である5,000件の営業案件データを投入
    const maxCaseCount = 5000;
    const mockCaseDataArray = Array.from({ length: maxCaseCount }, (_, index) => ({
      case_id: `CASE-${String(index + 1).padStart(5, '0')}`,
      customer_id: `CUST-${String((index % 100) + 1).padStart(4, '0')}`,
      sales_rep_id: `REP-${String((index % 50) + 1).padStart(3, '0')}`,
      process_stage: ['初回接触', '提案', '交渉', '成約'][index % 4],
      amount: 100000 + (index * 1000),
      contact_date: new Date('2024-01-01T00:00:00Z').getTime() + (index * 86400000),
      status: index % 10 === 0 ? 'CLOSED_WON' : 'ACTIVE',
    }));

    const input_data = {
      check_timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
      sales_case_dataset: mockCaseDataArray,
      system_config: {
        health_check_threshold_warning: 85,
        health_check_threshold_critical: 70,
        max_processing_timeout_seconds: 30,
      },
    };

    // ヘルスチェック結果レポート生成機能を呼び出し、5,000件全案件を対象としたレポート生成処理を実行
    const startTime = Date.now();
    const report_result = await generateHealthCheckResultReport(input_data);
    const elapsedTimeMs = Date.now() - startTime;

    // レポート生成処理の完了を待機し、タイムアウト（30秒以内）なく処理が終了することを確認
    expect(elapsedTimeMs).toBeLessThan(30000);

    // 生成されたレポートオブジェクトが存在し、null または undefined でないことを検証
    expect(report_result).toBeDefined();
    expect(report_result).not.toBeNull();

    // レポートに含まれるチェック結果データ件数が5,000件であることを確認
    expect(report_result.check_results).toBeDefined();
    expect(Array.isArray(report_result.check_results)).toBe(true);
    expect(report_result.check_results.length).toBe(maxCaseCount);

    // レポート内のシステムヘルスステータスが 'PASSED' または 'WARNING' のいずれかであることを検証
    expect(report_result.system_health_status).toMatch(/^(PASSED|WARNING)$/);

    // レポートが最小限の構造を持つことを確認
    expect(report_result.report_generated_at).toBeDefined();
    expect(typeof report_result.report_generated_at).toBe('string');
    expect(report_result.total_cases_checked).toBe(maxCaseCount);
  });
});