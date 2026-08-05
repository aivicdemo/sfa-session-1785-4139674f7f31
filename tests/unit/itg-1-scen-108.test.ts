import { describe, test, expect } from "@jest/globals";
import { determineSalesProcessLogExtractionPeriod } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-108: 抽出対象期間が月初と月末の同一月で期間開始日と終了日が異なる場合、対象期間が正しく確定される", () => {
    const start_date = new Date("2024-01-05T00:00:00Z");
    const end_date = new Date("2024-01-28T23:59:59Z");

    const result = determineSalesProcessLogExtractionPeriod({
      start_date,
      end_date,
    });

    expect(result.confirmed_start_date).toEqual(new Date("2024-01-05T00:00:00Z"));
    expect(result.confirmed_end_date).toEqual(new Date("2024-01-28T23:59:59Z"));
    expect(result.target_month).toBe("2024-01");
    expect(result.is_same_month).toBe(true);
  });
});