import { generateExecutivePersuasionMaterial } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料の自動生成", () => {
  // SCEN-2009
  test("提案の決定権者情報が未設定のとき、資料生成がエラーになる", () => {
    const proposalInput = {
      proposalId: "PROP-20240115-001",
      customerName: "株式会社サンプル",
      proposalAmount: 5000000,
      proposalContent: "クラウドシステム導入支援",
      investmentEffect: "年間コスト削減30%",
      riskFactors: ["導入期間の遅延リスク"],
      improvementProposal: "段階的な導入計画を提案",
      decisionMakerName: "",
      decisionMakerTitle: "",
      decisionMakerDepartment: "",
      decisionMakerContact: "",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      generateExecutivePersuasionMaterial(proposalInput, mockAIEngine)
    ).toThrow(/決定権者情報/);
  });
});