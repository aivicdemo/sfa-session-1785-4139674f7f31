import { evaluateProposalSuitability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1206
  test("顧客ニーズが null のとき、INVALID_INPUT_CUSTOMER_NEEDS_NULL エラーを返す", () => {
    const proposalContent = {
      productName: "クラウドERPシステム",
      description: "エンタープライズグレードのERP導入支援",
      price: 5000000,
    };

    const customerConstraints = {
      budgetLimit: 10000000,
      purchaseFrequency: "annually",
      allowedCategories: ["software", "services"],
    };

    const result = evaluateProposalSuitability({
      customerNeeds: null,
      proposalContent: proposalContent,
      customerConstraints: customerConstraints,
    });

    expect(result).toEqual({
      isError: true,
      errorCode: "INVALID_INPUT_CUSTOMER_NEEDS_NULL",
      errorMessage:
        "顧客ニーズは必須項目です。null を含めることはできません。",
    });
  });
});