import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-617: 提案精度が正確に計算される", () => {
    // Arrange: 営業担当者A（過去90日間の提案件数：20件、受注件数：5件）
    const salesRepId = "REP_A";
    const proposalCount = 20;
    const contractedCount = 5;
    const analysisStartDate = new Date("2024-10-01T00:00:00Z");
    const analysisEndDate = new Date("2024-12-30T23:59:59Z");

    const input = {
      salesRepId: salesRepId,
      proposalCount: proposalCount,
      contractedCount: contractedCount,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
    };

    // Act: 営業担当者Aの行動パターン分析レポート生成機能を実行
    const report = generateSalesRepBehaviorAnalysisReport(input);

    // Assert: レポート内の「提案精度」フィールドの計算値を確認
    // 期待値: 提案精度が25.0%（5件÷20件×100）で小数第1位までの精度で表示される
    const expectedProposalAccuracy = 25.0;
    expect(report.proposalAccuracy).toBe(expectedProposalAccuracy);
  });
});