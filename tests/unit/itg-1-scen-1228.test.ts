import { runTx1Imp1Agent } from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1228
  test("データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 自律処理が契約どおり実行される", async () => {
    fetchMock.resetMocks();

    // Mock: 営業システムAPI から営業プロセスログ100件を抽出
    const extracted_logs = Array.from({ length: 100 }, (_, i) => ({
      transaction_id: `tx_${String(i + 1).padStart(5, "0")}`,
      customer_id: `cust_${String((i % 50) + 1).padStart(3, "0")}`,
      amount: 10000 + i * 100,
      date: "2024-01-15",
      status: "completed",
    }));

    // Mock: 営業システムAPI レスポンス（抽出）
    fetchMock.mockResponseOnce(JSON.stringify({ logs: extracted_logs, count: 100 }), {
      status: 200,
    });

    // Mock: 顧客マスタAPI レスポンス（マスタ参照用）
    const customer_masters = Array.from({ length: 50 }, (_, i) => ({
      customer_id: `cust_${String(i + 1).padStart(3, "0")}`,
      name: `Customer ${i + 1}`,
    }));
    fetchMock.mockResponseOnce(JSON.stringify({ customers: customer_masters, count: 50 }), {
      status: 200,
    });

    // Mock: 分析システムAPI レスポンス（登録）
    fetchMock.mockResponseOnce(
      JSON.stringify({ status: "success", registered_count: 95 }),
      { status: 200 }
    );

    // Mock: ログストレージ保存レスポンス
    fetchMock.mockResponseOnce(
      JSON.stringify({ status: "saved", processing_log_id: "log_20240115_001" }),
      { status: 200 }
    );

    const input_start_date = "2024-01-01";
    const input_end_date = "2024-01-31";
    const input_target_staff_ids = [];

    const result = await runTx1Imp1Agent({
      start_date: input_start_date,
      end_date: input_end_date,
      target_staff_ids: input_target_staff_ids,
    });

    // Assertion: 抽出件数が100件
    expect(result.extracted_count).toBe(100);

    // Assertion: 正規化後件数が95件（重複5件を除外）
    expect(result.normalized_count).toBe(95);

    // Assertion: 検出された重複件数が5件
    expect(result.duplicates_detected).toBe(5);

    // Assertion: 品質スコアが85以上
    expect(result.quality_score).toBeGreaterThanOrEqual(85);
    expect(result.quality_score).toBeLessThanOrEqual(100);

    // Assertion: 分析システムへの登録件数が95件
    expect(result.analytics_system_registered_count).toBe(95);

    // Assertion: 成功フラグが true
    expect(result.success).toBe(true);

    // Assertion: 処理ログIDが返却される
    expect(result.processing_log_id).toBeDefined();
    expect(typeof result.processing_log_id).toBe("string");
  });
});