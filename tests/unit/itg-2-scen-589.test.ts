import { describe, test, expect } from "@jest/globals";
import { validateCustomerDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-589
  test("正規化済み顧客データ1件の場合、3観点すべてが検証対象に含まれる", () => {
    const normalizedCustomerData = {
      customer_id: "CUST-001",
      customer_name: "テスト株式会社",
      address: "東京都渋谷区1-1-1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    };

    const result = validateCustomerDataQuality(normalizedCustomerData);

    expect(result.completeness_status).toBe("validation_target");
    expect(result.consistency_status).toBe("validation_target");
    expect(result.accuracy_status).toBe("validation_target");
  });
});