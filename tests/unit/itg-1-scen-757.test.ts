import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターン分析対象指標の自動選定", () => {
  test("SCEN-757: 営業データ品質チェック未完了時は指標選定処理を実行しない", () => {
    const input = {
      dataQualityCheckStatus: "incomplete",
      businessPeriodStart: "2024-01-01",
      businessPeriodEnd: "2024-01-31",
      targetSalesPersonIds: ["SP001", "SP002"],
      standardProcessSteps: ["初回接触", "提案", "交渉", "成約"],
    };

    expect(() => selectAnalysisIndicators(input)).toThrow(/DATA_QUALITY_CHECK_INCOMPLETE/);
  });
});