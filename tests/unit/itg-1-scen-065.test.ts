import { determineExtractionDateRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-065
  test("抽出対象期間が年をまたぐとき全年のデータが範囲に含まれる", () => {
    const start_date = new Date("2023-11-01T00:00:00Z");
    const end_date = new Date("2024-02-28T00:00:00Z");

    const result = determineExtractionDateRange({
      start_date,
      end_date,
    });

    expect(result.extraction_start).toEqual(
      new Date("2023-11-01T00:00:00Z")
    );
    expect(result.extraction_end).toEqual(
      new Date("2024-02-28T23:59:59Z")
    );
    expect(result.includes_cross_year_boundary).toBe(true);
    expect(result.log_months_covered).toEqual([
      "2023-11",
      "2023-12",
      "2024-01",
      "2024-02",
    ]);
  });
});