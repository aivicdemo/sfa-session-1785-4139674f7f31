import { calculateProcessComplianceDeviation } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  test("SCEN-277: [normal] 標準プロセス遵守度スコア計算 - 提案ステップが標準プロセスから1日早いとき、乖離度として正の値が計算される", () => {
    const planned_proposal_date = new Date("2024-01-15T00:00:00Z");
    const actual_proposal_date = new Date("2024-01-14T00:00:00Z");

    const deviation_score = calculateProcessComplianceDeviation(
      planned_proposal_date,
      actual_proposal_date
    );

    expect(deviation_score).toBe(1.0);
  });
});