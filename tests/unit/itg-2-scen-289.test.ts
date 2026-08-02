import { calculateStandardProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 標準プロセス遵守度スコア計算", () => {
  test("SCEN-289: 営業担当者IDが商談記録から欠落しているとき、スコア計算がエラーになる", () => {
    const dealRecordWithMissingSalesPersonId = {
      dealId: "DEAL-001",
      salesPersonId: null,
      customerId: "CUST-001",
      dealStage: "初回接触",
      proposalDate: new Date("2024-01-15T10:00:00Z"),
      contactFrequency: 5,
      proposalContent: "システム導入提案",
      closingDate: null,
    };

    expect(() =>
      calculateStandardProcessComplianceScore(dealRecordWithMissingSalesPersonId)
    ).toThrow(/salesPersonId/);
  });
});