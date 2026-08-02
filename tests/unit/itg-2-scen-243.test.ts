import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-243: 正規化ルール件数が0件のとき、データ正規化処理がスキップされる", () => {
    // Setup: 正規化ルール件数0件の状態
    const normalizationRules: any[] = [];
    const inputCustomerData = [
      {
        customer_id: "C001",
        customer_name: "  株式会社ABC  ",
        postal_code: "100-0001",
        address: "東京都千代田区",
        email: "contact@abc.com",
      },
      {
        customer_id: "C002",
        customer_name: "ABC株式会社",
        postal_code: "100-0001",
        address: "東京都千代田区丸の内",
        email: "info@abc.co.jp",
      },
    ];

    // Execute: 顧客データ重複検出機能を実行
    const result = detectDuplicateCustomers({
      customer_data: inputCustomerData,
      normalization_rules: normalizationRules,
    });

    // Assert: 正規化処理がスキップされたことを確認
    expect(result.normalization_skipped).toBe(true);
    expect(result.normalization_rules_count).toBe(0);
    expect(result.process_log).toContain("正規化処理スキップ（ルール件数:0）");

    // Assert: 入力データがそのまま次のステップに渡されたことを確認
    expect(result.processed_data).toEqual(inputCustomerData);
    expect(result.processed_data[0].customer_name).toBe("  株式会社ABC  ");
    expect(result.processed_data[1].customer_name).toBe("ABC株式会社");

    // Assert: 重複検出ステップは実行されること
    expect(result.duplicate_detection_executed).toBe(true);
    expect(result.duplicate_candidates).toBeDefined();
  });
});