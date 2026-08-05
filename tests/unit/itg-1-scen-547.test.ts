import { describe, test, expect } from "@jest/globals";
import { analyzeBusinessActivityPatterns } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-547
  test("分析対象期間の開始日が日付型でない場合、エラーになる", () => {
    const invalid_start_date_string = "invalid_date";
    const valid_end_date = "2024-01-31";

    expect(() =>
      analyzeBusinessActivityPatterns({
        start_date: invalid_start_date_string,
        end_date: valid_end_date,
        sales_person_ids: ["SP001"],
      })
    ).toThrow(/分析対象期間の開始日/);
  });
});