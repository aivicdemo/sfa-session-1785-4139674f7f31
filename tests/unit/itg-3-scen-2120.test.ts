import { evaluateCustomerResponsePatternDivergence } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案内容と標準プロセスの乖離度算出", () => {
  // SCEN-2120
  test("顧客対応パターンの各要素が null を含むとき、エラーが発生する", () => {
    const customerResponsePatternWithNullCustomerId = {
      customerId: null,
      responsePhase: "negotiation",
      proposalApproach: "consultative",
      successMetric: "adoption_rate",
      actualValue: 0.75,
    };

    expect(() =>
      evaluateCustomerResponsePatternDivergence(
        customerResponsePatternWithNullCustomerId
      )
    ).toThrow(/顧客対応パターンの必須要素が不足/);
  });
});