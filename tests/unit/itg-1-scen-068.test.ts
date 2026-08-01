import { describe, test, expect } from "@jest/globals";
import { confirmSalesProcessLogExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-068
  test("抽出対象期間の終了日が月末のとき終了日が確定される", () => {
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-01-31T00:00:00Z");

    const result = confirmSalesProcessLogExtractionRange({
      startDate,
      endDate,
    });

    expect(result.confirmedEndDate).toEqual(new Date("2024-01-31T00:00:00Z"));
  });
});