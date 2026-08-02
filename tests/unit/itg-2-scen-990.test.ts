import { recordDataInconsistencyLogs } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-990
  test("データ不整合ログが複数件記録される場合に全て追跡される", () => {
    const inconsistency_1 = {
      inconsistency_type: "顧客ID不一致",
      record_id: "REC-001",
      timestamp: new Date("2024-01-15T10:30:00Z"),
      affected_field: "customer_id",
      expected_value: "CUST-001",
      actual_value: "CUST-999",
    };

    const inconsistency_2 = {
      inconsistency_type: "金額ズレ",
      record_id: "REC-002",
      timestamp: new Date("2024-01-15T10:31:00Z"),
      affected_field: "amount",
      expected_value: "50000",
      actual_value: "49999",
    };

    const inconsistency_3 = {
      inconsistency_type: "日付形式エラー",
      record_id: "REC-003",
      timestamp: new Date("2024-01-15T10:32:00Z"),
      affected_field: "transaction_date",
      expected_value: "2024-01-15",
      actual_value: "2024/01/15",
    };

    const inconsistencies = [inconsistency_1, inconsistency_2, inconsistency_3];

    const result = recordDataInconsistencyLogs(inconsistencies);

    expect(result.log_count).toBe(3);
    expect(result.logs).toHaveLength(3);

    expect(result.logs[0]).toEqual({
      inconsistency_type: "顧客ID不一致",
      record_id: "REC-001",
      timestamp: new Date("2024-01-15T10:30:00Z").toISOString(),
      affected_field: "customer_id",
      expected_value: "CUST-001",
      actual_value: "CUST-999",
      sequence_order: 1,
    });

    expect(result.logs[1]).toEqual({
      inconsistency_type: "金額ズレ",
      record_id: "REC-002",
      timestamp: new Date("2024-01-15T10:31:00Z").toISOString(),
      affected_field: "amount",
      expected_value: "50000",
      actual_value: "49999",
      sequence_order: 2,
    });

    expect(result.logs[2]).toEqual({
      inconsistency_type: "日付形式エラー",
      record_id: "REC-003",
      timestamp: new Date("2024-01-15T10:32:00Z").toISOString(),
      affected_field: "transaction_date",
      expected_value: "2024-01-15",
      actual_value: "2024/01/15",
      sequence_order: 3,
    });

    expect(result.logs.every((log) => log.record_id.match(/^REC-\d+$/))).toBe(
      true
    );
    expect(result.logs.every((log) => log.timestamp)).toBe(true);
    expect(
      result.logs.map((log) => log.inconsistency_type)
    ).toEqual(["顧客ID不一致", "金額ズレ", "日付形式エラー"]);
  });
});