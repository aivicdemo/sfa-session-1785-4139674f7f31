import { calculateProposalCustomerFitScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-702
  test("提案資料と顧客ニーズの適合度スコア化機能 - 顧客業種が完全に一致するとき、業種適合スコアが最高値になる", () => {
    const customer = {
      id: "CUST001",
      industry: "IT・通信",
      name: "テスト顧客A",
      region: "関東",
    };

    const proposalDocument = {
      id: "PROP001",
      targetIndustry: "IT・通信",
      title: "デジタル変革ソリューション提案",
      budget: 5000000,
    };

    const fitScore = calculateProposalCustomerFitScore(
      customer,
      proposalDocument
    );

    expect(fitScore.industryMatchScore).toBe(100);
  });
});