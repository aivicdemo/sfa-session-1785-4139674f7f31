import { describe, test, expect } from "@jest/globals";
import { calculateProcessAdherenceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-232: [error] 標準プロセス遵守度スコア計算機能 - 商談記録の実行日時が不正な日付形式のときエラーになる
  test("should throw error with INVALID_DATETIME_FORMAT when dealRecordExecutionDateTime is malformed", () => {
    const malformedDealRecord = {
      dealRecordId: "DR-20240115-001",
      dealRecordExecutionDateTime: "2024-13-45",
      dealRecordExecutionContent: "Initial contact with customer",
      dealRecordSalesRepresentativeId: "SR-001",
      dealRecordCustomerId: "CUST-001",
      dealRecordStandardProcessStep: "Initial Contact",
    };

    expect(() => calculateProcessAdherenceScore(malformedDealRecord)).toThrow(
      /INVALID_DATETIME_FORMAT/
    );
  });
});