import { calculateTeamAverageProposalAccuracy } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-623
  test("チーム平均提案精度が複数担当者から正確に計算される", () => {
    const salesRepresentatives = [
      {
        id: "rep_001",
        name: "営業担当者A",
        proposalAccuracy: 85,
        proposalCount: 20,
      },
      {
        id: "rep_002",
        name: "営業担当者B",
        proposalAccuracy: 92,
        proposalCount: 25,
      },
      {
        id: "rep_003",
        name: "営業担当者C",
        proposalAccuracy: 78,
        proposalCount: 16,
      },
    ];

    const result = calculateTeamAverageProposalAccuracy(salesRepresentatives);

    expect(result).toBe(85.0);
  });
});