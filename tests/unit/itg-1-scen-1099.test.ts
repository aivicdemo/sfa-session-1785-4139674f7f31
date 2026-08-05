import { analyzeActionPatternBySalesPersonAndContractResult } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能", () => {
  // SCEN-1099
  test("[normal] 成約実績複数件の営業担当者について行動パターン分析が実行される", () => {
    const salesPersonId = "sp_001";
    const salesPersonName = "A";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-03-31T23:59:59Z");

    const dealData = [
      {
        dealId: "deal_001",
        salesPersonId: salesPersonId,
        dealName: "案件1",
        initialContactDate: new Date("2024-01-08T09:00:00Z"),
        proposalDate: new Date("2024-01-15T10:00:00Z"),
        contractDate: new Date("2024-01-29T14:00:00Z"),
        contactCount: 4,
      },
      {
        dealId: "deal_002",
        salesPersonId: salesPersonId,
        dealName: "案件2",
        initialContactDate: new Date("2024-02-05T09:00:00Z"),
        proposalDate: new Date("2024-02-12T10:00:00Z"),
        contractDate: new Date("2024-02-26T14:00:00Z"),
        contactCount: 3,
      },
      {
        dealId: "deal_003",
        salesPersonId: salesPersonId,
        dealName: "案件3",
        initialContactDate: new Date("2024-03-04T09:00:00Z"),
        proposalDate: new Date("2024-03-11T10:00:00Z"),
        contractDate: new Date("2024-03-25T14:00:00Z"),
        contactCount: 3,
      },
    ];

    const result = analyzeActionPatternBySalesPersonAndContractResult({
      salesPersonId: salesPersonId,
      salesPersonName: salesPersonName,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
      deals: dealData,
    });

    expect(result.salesPersonName).toBe("A");
    expect(result.analyzedDealCount).toBe(3);
    expect(result.averageContractPeriodDays).toBe(45);
    expect(result.averageDaysFromInitialContactToContract).toBe(42);
    expect(result.customerContactFrequencyPerWeek).toBeCloseTo(2.5, 1);
    expect(result.averageDaysFromProposalToContract).toBe(15);
  });
});