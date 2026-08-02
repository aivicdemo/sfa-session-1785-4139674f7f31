import { validateProposalFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1025
  test("提案内容の提案日付が月末日である場合に形式検証が成功する", () => {
    const proposalData = {
      proposal_id: "PROP-001",
      customer_id: "CUST-001",
      proposal_amount: 500000,
      proposal_date: "2024-01-31",
      proposal_name: "システム導入提案",
      status: "active",
    };

    const result = validateProposalFormat(proposalData);

    expect(result.status).toBe("成功");
    expect(result.errors).toEqual([]);
    expect(result.message).toBe("提案日付の形式が有効です");
  });
});