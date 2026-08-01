import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-640
  test("成約実績データが過去3ヶ月分0件の場合、成約率が0として計算される", () => {
    const salesPersonId = "SP001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-03-31T23:59:59Z");

    const input = {
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      dealRecords: [],
      contractedDeals: [],
      customerContactLogs: [
        {
          customerId: "CUST001",
          contactDate: new Date("2024-01-15T10:00:00Z"),
          contactType: "訪問",
          salesPersonId,
        },
        {
          customerId: "CUST002",
          contactDate: new Date("2024-02-10T14:00:00Z"),
          contactType: "電話",
          salesPersonId,
        },
        {
          customerId: "CUST003",
          contactDate: new Date("2024-03-20T11:00:00Z"),
          contactType: "メール",
          salesPersonId,
        },
      ],
      proposalRecords: [
        {
          proposalId: "PROP001",
          dealId: "DEAL001",
          proposalDate: new Date("2024-01-20T09:00:00Z"),
          salesPersonId,
          status: "提案済み",
        },
        {
          proposalId: "PROP002",
          dealId: "DEAL002",
          proposalDate: new Date("2024-02-15T10:00:00Z"),
          salesPersonId,
          status: "提案済み",
        },
      ],
    };

    const result = generateBehaviorPatternAnalysisReport(input);

    expect(result).toEqual({
      salesPersonId: "SP001",
      analysisStartDate: new Date("2024-01-01T00:00:00Z"),
      analysisEndDate: new Date("2024-03-31T23:59:59Z"),
      totalDeals: 2,
      contractedDeals: 0,
      contractRatio: 0,
      contactFrequency: 3,
      averageProposalValue: 0,
      proposalCount: 2,
      totalContactCount: 3,
      generatedAt: expect.any(Date),
      status: "success",
      errors: [],
    });
    expect(result.contractRatio).toBe(0);
    expect(result.contractedDeals).toBe(0);
  });
});