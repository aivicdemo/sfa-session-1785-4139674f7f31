import { describe, test, expect } from "@jest/globals";
import { determineSalesProcessLogExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-101
  test("対象営業担当者リストが null のときエラーになる", () => {
    const extraction_start_datetime = new Date("2024-01-01T00:00:00Z");
    const extraction_end_datetime = new Date("2024-01-31T23:59:59Z");
    const target_sales_staff_list = null;

    expect(() =>
      determineSalesProcessLogExtractionRange(
        extraction_start_datetime,
        extraction_end_datetime,
        target_sales_staff_list
      )
    ).toThrow(/営業担当者リスト/);
  });
});