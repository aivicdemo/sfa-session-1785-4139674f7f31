import { validateProposalData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1019
  test("提案内容の金額項目が負数である場合に値域検証エラーとして拒否される", () => {
    const proposalData = {
      proposalId: "PROP-20240115-001",
      customerId: "CUST-12345",
      customerName: "サンプル顧客株式会社",
      proposalDate: new Date("2024-01-15T11:00:00Z"),
      amount: -50000,
      productCategory: "SOFTWARE",
      status: "DRAFT"
    };

    expect(() => validateProposalData(proposalData)).toThrow(/提案金額/);
  });
});