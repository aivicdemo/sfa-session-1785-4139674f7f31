import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-296
  test("標準プロセス遵守度スコア計算 - 複数営業担当者の商談記録に重複データが含まれるとき、各営業担当者のスコアが個別に正しく計算される", () => {
    const salesPersonIdA = "sales-001";
    const salesPersonIdB = "sales-002";
    const customerId1 = "cust-101";
    const customerId2 = "cust-102";

    const dealRecordsA = [
      {
        dealId: "deal-001",
        salesPersonId: salesPersonIdA,
        customerId: customerId1,
        stage: "初回接触",
        completedSteps: ["initial_contact"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
      {
        dealId: "deal-002",
        salesPersonId: salesPersonIdA,
        customerId: customerId2,
        stage: "提案",
        completedSteps: ["initial_contact", "proposal"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
      {
        dealId: "deal-002",
        salesPersonId: salesPersonIdA,
        customerId: customerId2,
        stage: "提案",
        completedSteps: ["initial_contact", "proposal"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
      {
        dealId: "deal-003",
        salesPersonId: salesPersonIdA,
        customerId: customerId1,
        stage: "交渉",
        completedSteps: ["initial_contact", "proposal", "negotiation"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
    ];

    const dealRecordsB = [
      {
        dealId: "deal-004",
        salesPersonId: salesPersonIdB,
        customerId: customerId1,
        stage: "初回接触",
        completedSteps: ["initial_contact"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
      {
        dealId: "deal-005",
        salesPersonId: salesPersonIdB,
        customerId: customerId2,
        stage: "交渉",
        completedSteps: ["initial_contact", "proposal", "negotiation"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
      {
        dealId: "deal-005",
        salesPersonId: salesPersonIdB,
        customerId: customerId2,
        stage: "交渉",
        completedSteps: ["initial_contact", "proposal", "negotiation"],
        standardSteps: ["initial_contact", "proposal", "negotiation", "close"],
      },
    ];

    const scoreA = calculateProcessComplianceScore(dealRecordsA);
    const scoreB = calculateProcessComplianceScore(dealRecordsB);

    expect(scoreA).toBe(85.5);
    expect(scoreB).toBe(72.3);
    expect(scoreA).not.toBe(scoreB);
  });
});