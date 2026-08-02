import { validateProposalDataFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1026
  test("提案内容の提案日付が月初日である場合に形式検証が成功する", () => {
    const proposalData = {
      proposalId: "PROP-20240101-001",
      customerId: "CUST-12345",
      proposalDate: "2024-01-01",
      productCategory: "enterprise-solution",
      amount: 500000,
      currency: "JPY",
      status: "submitted",
    };

    const result = validateProposalDataFormat(proposalData);

    expect(result).toEqual({
      validationPassed: true,
      errors: [],
    });
  });
});