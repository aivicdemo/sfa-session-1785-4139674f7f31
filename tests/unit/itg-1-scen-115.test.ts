import { describe, test, expect, beforeEach } from "@jest/globals";
import { determineSalesRepExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログデータ抽出範囲確定機能", () => {
  // SCEN-115
  test("抽出対象営業担当者の範囲が1名ちょうどの場合、対象営業担当者の範囲が正しく確定される", () => {
    const selected_sales_reps = ["EMP001"];
    const result = determineSalesRepExtractionRange(selected_sales_reps);

    expect(result).toEqual({
      target_sales_rep_ids: ["EMP001"],
      target_count: 1,
      extraction_range_confirmed: true,
    });
  });
});