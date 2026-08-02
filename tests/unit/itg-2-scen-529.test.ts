import { judgeCustomerDuplication } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-529
  test("統合判定の根拠となった判定基準が記録される", () => {
    const recordA = {
      customerId: "CUST001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
    };

    const recordB = {
      customerId: "CUST002",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-9999-9999",
    };

    const result = judgeCustomerDuplication(recordA, recordB);

    expect(result).toBeDefined();
    expect(result.shouldMerge).toBe(true);
    expect(result.reason).toBeDefined();
    expect(typeof result.reason).toBe("string");
    expect(result.reason.length).toBeGreaterThan(0);
    expect(result.reason).toMatch(/名前.*メール|スコア|基準/);
    expect(result.matchingScore).toBeGreaterThanOrEqual(80);
    expect(result.appliedCriteria).toBeDefined();
    expect(Array.isArray(result.appliedCriteria)).toBe(true);
    expect(result.appliedCriteria.length).toBeGreaterThan(0);
  });
});