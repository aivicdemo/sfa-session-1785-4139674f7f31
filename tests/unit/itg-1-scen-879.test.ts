import { describe, test, expect } from "@jest/globals";
import { analyzeTeamQualityStatistics } from "../../src/logic/it-1-br-2-1-1";

describe("Team Sales Quality Statistics Analysis - Empty Proposal Accuracy Data", () => {
  // SCEN-879: [error] チーム営業品質統計分析機能 - 営業担当者ごとの提案精度データが空のとき、エラーになる
  test("should throw error when proposal accuracy data is empty", () => {
    const empty_proposal_accuracy_data = [];

    expect(() =>
      analyzeTeamQualityStatistics({
        proposal_accuracy_records: empty_proposal_accuracy_data,
      })
    ).toThrow(/提案精度データが存在しません/);
  });
});