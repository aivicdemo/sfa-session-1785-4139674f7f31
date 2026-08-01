import { describe, test, expect } from "@jest/globals";
import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-345
  test("同じスコアを持つ複数の営業担当者がレポートに含まれる場合、順序が安定している", () => {
    const salesPersonA = {
      id: "SP001",
      name: "営業担当者A",
      behaviorEfficiencyScore: 85,
      visitCount: 12,
      proposalCount: 8,
      closedDealCount: 3,
    };

    const salesPersonB = {
      id: "SP002",
      name: "営業担当者B",
      behaviorEfficiencyScore: 85,
      visitCount: 11,
      proposalCount: 9,
      closedDealCount: 3,
    };

    const salesPersonC = {
      id: "SP003",
      name: "営業担当者C",
      behaviorEfficiencyScore: 85,
      visitCount: 13,
      proposalCount: 7,
      closedDealCount: 2,
    };

    const inputData = {
      salesPeople: [salesPersonA, salesPersonB, salesPersonC],
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
    };

    const executionResults: Array<Array<string>> = [];

    for (let iteration = 0; iteration < 5; iteration++) {
      const report = generateSalesActivityPatternReport(inputData);

      const orderInReport = report.salesActivityPatterns.map(
        (pattern: { salesPersonId: string }) => pattern.salesPersonId
      );

      executionResults.push(orderInReport);
    }

    const firstExecution = executionResults[0];

    for (let i = 1; i < executionResults.length; i++) {
      expect(executionResults[i]).toEqual(firstExecution);
    }

    expect(firstExecution).toEqual(["SP001", "SP002", "SP003"]);
  });
});