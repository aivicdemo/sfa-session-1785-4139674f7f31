import { extractFailurePatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能 - 失敗パターン抽出", () => {
  // SCEN-834
  test("行動ログデータが複数件のとき、全件を対象に失敗パターン抽出が実行される", () => {
    const action_log_001 = {
      log_id: "001",
      process_id: "proc_a",
      process_state: "failed",
      error_code: "E001",
      timestamp: "2024-01-15T10:00:00Z",
      sales_rep_id: "rep_001"
    };

    const action_log_002 = {
      log_id: "002",
      process_id: "proc_b",
      process_state: "failed",
      error_code: "E002",
      timestamp: "2024-01-15T11:00:00Z",
      sales_rep_id: "rep_002"
    };

    const action_log_003 = {
      log_id: "003",
      process_id: "proc_c",
      process_state: "failed",
      error_code: "E003",
      timestamp: "2024-01-15T12:00:00Z",
      sales_rep_id: "rep_003"
    };

    const action_logs = [action_log_001, action_log_002, action_log_003];

    const result = extractFailurePatterns(action_logs);

    expect(result.total_processed_count).toBe(3);
    expect(result.failure_patterns).toHaveLength(3);
    expect(result.failure_patterns[0]).toEqual(
      expect.objectContaining({
        log_id: "001",
        process_id: "proc_a",
        failure_type: expect.any(String),
        error_code: "E001"
      })
    );
    expect(result.failure_patterns[1]).toEqual(
      expect.objectContaining({
        log_id: "002",
        process_id: "proc_b",
        failure_type: expect.any(String),
        error_code: "E002"
      })
    );
    expect(result.failure_patterns[2]).toEqual(
      expect.objectContaining({
        log_id: "003",
        process_id: "proc_c",
        failure_type: expect.any(String),
        error_code: "E003"
      })
    );
  });
});