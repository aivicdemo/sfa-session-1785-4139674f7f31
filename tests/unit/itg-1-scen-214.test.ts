import {
  calculateProcessComplianceScore,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス遵守度スコア計算", () => {
  // SCEN-214
  test("標準プロセス全ステップ完全準拠時にスコアが100%で計算される", () => {
    const salesRepId = "SR001";
    const dealId = "DEAL001";
    const initialContactDate = new Date("2024-01-15T10:00:00Z");
    const proposalDate = new Date("2024-01-20T14:30:00Z");
    const negotiationDate = new Date("2024-01-25T11:00:00Z");
    const contractSignDate = new Date("2024-01-28T16:45:00Z");

    const dealRecord = {
      dealId: dealId,
      salesRepId: salesRepId,
      initialContactDate: initialContactDate,
      initialContactCompleted: true,
      proposalDate: proposalDate,
      proposalCompleted: true,
      negotiationDate: negotiationDate,
      negotiationCompleted: true,
      contractSignDate: contractSignDate,
      contractSignCompleted: true,
    };

    const standardProcess = {
      steps: [
        {
          stepName: "初回接触",
          stepOrder: 1,
        },
        {
          stepName: "提案",
          stepOrder: 2,
        },
        {
          stepName: "交渉",
          stepOrder: 3,
        },
        {
          stepName: "成約",
          stepOrder: 4,
        },
      ],
    };

    const result = calculateProcessComplianceScore(dealRecord, standardProcess);

    expect(result).toEqual({
      complianceScore: 100.0,
      totalSteps: 4,
      completedSteps: 4,
      compliancePercentage: "100%",
      dealId: dealId,
      salesRepId: salesRepId,
    });
  });
});