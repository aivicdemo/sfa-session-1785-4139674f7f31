import { describe, test, expect } from "@jest/globals";
import { validateDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-606
  test("妥当性検証で日付が年度をまたぐ場合、合格と判定される", () => {
    const validationRule = {
      targetField: "営業期間",
      validationType: "日付範囲チェック",
    };

    const testData = {
      営業期間: {
        startDate: "2024-03-15",
        endDate: "2025-04-30",
      },
    };

    const result = validateDataQuality(testData, validationRule);

    expect(result.status).toBe("PASS");
    expect(result.message).toMatch(/年度をまたいでも有効/);
    expect(result.hasError).toBe(false);
  });
});