import {
  analyzeSalesRepresentativePattern,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-407
  test("同じ入力データで分析を2回実行した場合、同じ乖離度と合致度が計算される", () => {
    const salesRepresentativeActionData = {
      visitCount: 5,
      phoneContactCount: 3,
      emailSendCount: 2,
    };

    const salesResultData = {
      contractAmount: 1000000,
      contractDate: new Date("2024-01-15T00:00:00Z"),
    };

    const firstAnalysisResult = analyzeSalesRepresentativePattern(
      salesRepresentativeActionData,
      salesResultData
    );

    const secondAnalysisResult = analyzeSalesRepresentativePattern(
      salesRepresentativeActionData,
      salesResultData
    );

    expect(firstAnalysisResult.divergenceDegree).toBe(
      secondAnalysisResult.divergenceDegree
    );
    expect(firstAnalysisResult.matchDegree).toBe(
      secondAnalysisResult.matchDegree
    );

    expect(firstAnalysisResult.divergenceDegree).toBe(0.35);
    expect(firstAnalysisResult.matchDegree).toBe(0.72);
  });
});