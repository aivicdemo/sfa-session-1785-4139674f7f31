import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-558
  test("指定した営業担当者が営業担当者マスタに存在しない場合、ERR_SALESPERSON_NOT_FOUND エラーを返す", () => {
    const nonExistentSalesPersonId = "SALES-99999";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        salesPersonId: nonExistentSalesPersonId,
        startDate: analysisStartDate,
        endDate: analysisEndDate,
      })
    ).toThrow(/営業担当者/);
  });
});