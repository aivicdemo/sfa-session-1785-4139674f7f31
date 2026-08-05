import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateSystemHealthcheckReport } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-308: [normal] システムヘルスチェック判定機能 - チェック対象がゼロ件の場合でもレポートが生成される
  test("should generate a valid health check report when target data is empty", () => {
    const execution_timestamp = new Date("2024-01-15T10:30:00Z");
    const target_data_count = 0;
    const check_results = [];
    const execution_status = "completed";

    const report = generateSystemHealthcheckReport({
      execution_timestamp,
      target_data_count,
      check_results,
      execution_status,
    });

    // ヘッダー情報の検証
    expect(report).toBeDefined();
    expect(report.header).toBeDefined();
    expect(report.header.execution_timestamp).toEqual(execution_timestamp);
    expect(report.header.target_count).toBe(0);

    // チェック結果セクションの検証
    expect(report.check_results_section).toBeDefined();
    expect(Array.isArray(report.check_results_section.results)).toBe(true);
    expect(report.check_results_section.results).toHaveLength(0);

    // サマリーセクションの検証
    expect(report.summary_section).toBeDefined();
    expect(report.summary_section.execution_status).toBe("completed");

    // レポートがファイルまたはオブジェクト形式で出力可能な状態を確認
    expect(typeof report).toBe("object");
    expect(JSON.stringify(report)).toBeDefined();
  });
});