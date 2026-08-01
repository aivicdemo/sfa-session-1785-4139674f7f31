import { recordCustomerReaction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-293
  test("顧客反応記録・標準化機能 - メール返信反応を標準分類パターンに従って記録される", () => {
    const customer_id = "CUST-20240115-001";
    const email_text =
      "ご提案ありがとうございます。前向きに検討させていただきます。";
    const standard_patterns = [
      { pattern_id: "PAT-001", label: "肯定的返信", keywords: ["前向き", "検討"] },
      {
        pattern_id: "PAT-002",
        label: "否定的返信",
        keywords: ["難しい", "見送り"],
      },
      {
        pattern_id: "PAT-003",
        label: "質問返信",
        keywords: ["質問", "確認", "教えて"],
      },
      { pattern_id: "PAT-004", label: "返信なし", keywords: [] },
    ];
    const record_timestamp = new Date("2024-01-15T14:30:00Z");

    const result = recordCustomerReaction({
      customer_id,
      email_text,
      standard_patterns,
      record_timestamp,
    });

    expect(result).toEqual({
      customer_id: "CUST-20240115-001",
      email_text:
        "ご提案ありがとうございます。前向きに検討させていただきます。",
      classified_pattern: "肯定的返信",
      pattern_id: "PAT-001",
      recorded_at: new Date("2024-01-15T14:30:00Z"),
      is_stored: true,
    });
  });
});