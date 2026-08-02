import { detectDuplicateAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複検出・統合判定機能", () => {
  test("SCEN-127: 検査対象の顧客レコードが1件のとき、重複なしと判定される", () => {
    const input_customers = [
      {
        customer_id: "CUST-001",
        customer_name: "山田太郎",
        email: "yamada.taro@example.com",
        phone: "090-1234-5678",
        company_name: "ABC株式会社",
        address: "東京都渋谷区",
      },
    ];

    const result = detectDuplicateAndJudgeIntegration(input_customers);

    expect(result.duplicate_detection_result).toBe("重複なし");
    expect(result.integration_judgment_status).toBe("統合不要");
    expect(result.duplicate_candidates).toEqual([]);
    expect(result.processing_timestamp).toBeDefined();
  });
});