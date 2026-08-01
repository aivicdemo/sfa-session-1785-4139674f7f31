import { describe, test, expect } from "@jest/globals";
import { validateExtractionDateRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-073
  test("抽出対象期間の開始日が終了日より後のときエラーとなる", () => {
    const start_date = new Date("2024-12-31");
    const end_date = new Date("2024-12-25");

    expect(() =>
      validateExtractionDateRange({
        start_date,
        end_date,
      })
    ).toThrow(/開始日/);
  });
});