import { detectAndJudgeDuplicateCustomers } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 顧客データ重複検出・統合判定機能", () => {
  test("SCEN-177: 重複検出処理の実行時間が5秒以内に完了する", () => {
    const testCustomerDataset = Array.from({ length: 1000 }, (_, idx) => ({
      customer_id: `CUST-${String(idx + 1).padStart(5, "0")}`,
      customer_name: idx % 2 === 0 ? "Test Company A" : "テスト会社B",
      customer_kana: idx % 2 === 0 ? "テストカンパニーエー" : "テストカイシャビー",
      postal_code: idx % 2 === 0 ? "100-0001" : "150-0001",
      prefecture: idx % 2 === 0 ? "東京都" : "東京都",
      city: idx % 2 === 0 ? "千代田区" : "渋谷区",
      address_detail: idx % 2 === 0 ? "丸の内1-1-1" : "道玄坂1-2-3",
      phone_number: idx % 2 === 0 ? "03-1234-5678" : "03-9876-5432",
      email: idx % 2 === 0 ? `contact${idx}@testcompany.jp` : `info${idx}@testcompany.jp`,
      industry_code: "1234",
      establishment_date: "2020-01-15",
      capital_amount: 100000000,
      employee_count: 50,
      sales_amount_annual: 500000000,
      created_at: new Date("2024-01-01T00:00:00Z"),
      updated_at: new Date("2024-01-15T12:00:00Z"),
    }));

    const start_time = performance.now();
    const result = detectAndJudgeDuplicateCustomers(testCustomerDataset);
    const end_time = performance.now();

    const execution_time_ms = end_time - start_time;
    const execution_time_seconds = execution_time_ms / 1000;

    expect(execution_time_seconds).toBeLessThanOrEqual(5);
    expect(result).toHaveProperty("duplicate_groups");
    expect(result).toHaveProperty("merge_decisions");
    expect(Array.isArray(result.duplicate_groups)).toBe(true);
    expect(Array.isArray(result.merge_decisions)).toBe(true);
  });
});