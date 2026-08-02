import { visualizeDetectedIssuePatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-1201
  test("検出問題パターンの可視化 - 検証エラーが発生したレコードのIDが正確に問題パターンに含まれる", () => {
    const input_records = [
      {
        record_id: "R001",
        sales_rep_name: "山田太郎",
        revenue_amount: 500000,
        validation_errors: [],
      },
      {
        record_id: "R002",
        sales_rep_name: null,
        revenue_amount: 300000,
        validation_errors: ["必須フィールド欠落：営業担当者名"],
      },
      {
        record_id: "R003",
        sales_rep_name: "佐藤花子",
        revenue_amount: 750000,
        validation_errors: [],
      },
      {
        record_id: "R004",
        sales_rep_name: "鈴木次郎",
        revenue_amount: "250000",
        validation_errors: ["データ型不正：売上金額が文字列"],
      },
      {
        record_id: "R005",
        sales_rep_name: "田中美咲",
        revenue_amount: 1000000,
        validation_errors: [],
      },
    ];

    const result = visualizeDetectedIssuePatterns(input_records);

    expect(result.error_records).toEqual([
      {
        record_id: "R002",
        error_details: "必須フィールド欠落：営業担当者名",
      },
      {
        record_id: "R004",
        error_details: "データ型不正：売上金額が文字列",
      },
    ]);

    expect(result.total_error_count).toBe(2);
    expect(result.total_record_count).toBe(5);
    expect(result.clean_record_ids).toEqual(["R001", "R003", "R005"]);
  });
});