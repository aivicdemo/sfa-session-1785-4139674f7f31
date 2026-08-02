import { describe, test, expect } from "@jest/globals";
import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-093: 検証実行日時が記録される", () => {
    const beforeExecution = new Date();
    const beforeExecutionIso = beforeExecution.toISOString();

    const result = validateSalesDataQuality({
      customerId: "CUST-001",
      customerName: "テスト顧客",
      email: "test@example.com",
      phone: "09012345678",
      address: "東京都渋谷区",
      registrationDate: "2024-01-01",
    });

    const afterExecution = new Date();
    const afterExecutionIso = afterExecution.toISOString();

    expect(result.executedAt).toBeDefined();
    expect(typeof result.executedAt).toBe("string");

    const executedAtDate = new Date(result.executedAt);
    const beforeDate = new Date(beforeExecutionIso);
    const afterDate = new Date(afterExecutionIso);

    expect(executedAtDate.getTime()).toBeGreaterThanOrEqual(beforeDate.getTime());
    expect(executedAtDate.getTime()).toBeLessThanOrEqual(afterDate.getTime());

    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(result.executedAt).toMatch(iso8601Regex);
  });
});