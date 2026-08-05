import { describe, it, expect } from "@jest/globals";
import { determineSalesProcessLogExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログデータ抽出範囲確定機能", () => {
  it("SCEN-112: 抽出対象期間が月初日の翌日で開始する場合、期間開始日が正しく確定される", () => {
    const startDate = "2024-02-02";
    const endDate = "2024-02-29";

    const result = determineSalesProcessLogExtractionRange({
      startDate,
      endDate,
    });

    expect(result.confirmedStartDate).toBe("2024-02-02");
  });
});