import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesPersonActionPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1108
  it("分析対象期間の開始日が欠落しているとき、処理がエラーになること", () => {
    const input = {
      start_date: null,
      end_date: "2024-12-31",
      sales_person_id: "営業担当者A"
    };

    expect(() => {
      generateSalesPersonActionPatternReport(input);
    }).toThrow(/開始日/);
  });
});