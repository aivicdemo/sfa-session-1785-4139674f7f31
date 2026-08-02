import { calculateProcessComplianceDeviationScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 標準プロセス遵守度スコア計算", () => {
  // SCEN-280
  test("should calculate positive deviation score when negotiation step completes 1 day earlier than standard process", () => {
    const standardProcessDate = new Date("2024-01-15T00:00:00Z");
    const actualCompletionDate = new Date("2024-01-14T00:00:00Z");

    const deviationScore = calculateProcessComplianceDeviationScore({
      stepName: "negotiation",
      standardProcessDate: standardProcessDate,
      actualCompletionDate: actualCompletionDate,
    });

    expect(deviationScore).toBe(1.0);
  });
});