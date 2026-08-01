import { describe, test, expect } from "@jest/globals";
import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-362
  test("営業担当者IDが空文字のとき、エラーが発生する", () => {
    const emptyRepId = "";

    expect(() => {
      generateSalesRepBehaviorAnalysisReport({
        salesRepId: emptyRepId,
        analysisStartDate: "2024-01-01",
        analysisEndDate: "2024-01-31",
      });
    }).toThrow(/営業担当者ID/);
  });
});