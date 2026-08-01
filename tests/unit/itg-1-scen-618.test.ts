import { calculateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-618
  test("提案精度が0の場合、正常に集計される", () => {
    const salesPersonId = "SP001";
    const proposalCount = 5;
    const proposalSuccessCount = 0;
    const followUpCount = 3;
    const customerContactFrequency = 2.5;
    const processComplianceScore = 78;

    const result = calculateSalesPersonBehaviorAnalysisReport({
      salesPersonId,
      proposalCount,
      proposalSuccessCount,
      followUpCount,
      customerContactFrequency,
      processComplianceScore,
    });

    expect(result.proposalAccuracy).toBe(0.0);
    expect(result.proposalCount).toBe(5);
    expect(result.proposalSuccessCount).toBe(0);
    expect(result.successRate).toBe(0.0);
    expect(result.followUpCount).toBe(3);
    expect(result.customerContactFrequency).toBe(2.5);
    expect(result.processComplianceScore).toBe(78);
    expect(result.reportGeneratedAt).toBeDefined();
    expect(typeof result.reportGeneratedAt).toBe("string");
  });
});