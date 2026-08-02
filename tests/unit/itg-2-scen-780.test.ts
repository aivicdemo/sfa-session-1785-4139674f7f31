import { calculateSalesPerformanceAnalysis } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  test("SCEN-780: 成約実績が複数件の営業担当者の成約率が正しく計算される", () => {
    // 準備: 営業担当者Aのテストデータ
    const salesRepId = "REP-A001";
    const contractedDeals = [
      {
        dealId: "DEAL-001",
        contractAmount: 1000000,
        status: "成約",
      },
      {
        dealId: "DEAL-002",
        contractAmount: 1500000,
        status: "成約",
      },
      {
        dealId: "DEAL-003",
        contractAmount: 2000000,
        status: "成約",
      },
    ];

    const proposalCount = 5;

    const analysisInput = {
      salesRepId,
      contractedDeals,
      proposalCount,
    };

    // 実行: 営業プロセス実行状況分析機能を実行
    const result = calculateSalesPerformanceAnalysis(analysisInput);

    // 検証: 成約率が60%として計算されていることを確認
    expect(result.contractRate).toBe(60);
    expect(result.contractedCount).toBe(3);
    expect(result.totalProposalCount).toBe(5);
    expect(result.salesRepId).toBe("REP-A001");
  });
});