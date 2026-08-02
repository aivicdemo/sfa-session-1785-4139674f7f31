import { scoreProposalCustomerFitness } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-704
  test("提案資料と顧客ニーズの適合度スコア化機能 - 顧客業種が部分的に一致するとき、業種適合スコアが中間値になる", () => {
    const customerNeed = {
      industry: "金融業",
    };

    const proposalMaterial = {
      targetIndustries: ["金融業", "保険業"],
    };

    const result = scoreProposalCustomerFitness(
      customerNeed,
      proposalMaterial
    );

    expect(result.industryFitnessScore).toBe(0.5);
  });
});