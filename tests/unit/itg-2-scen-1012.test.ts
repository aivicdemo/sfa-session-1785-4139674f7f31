import { validateProposalAmountRange } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1012
  test("提案内容の金額が0円の場合に値域検証が成功する", () => {
    const proposal = {
      proposalId: "PROP-20240115-001",
      customerName: "テスト顧客",
      proposalDate: "2024-01-15",
      amount: 0,
    };

    const result = validateProposalAmountRange(proposal);

    expect(result.validationStatus).toBe("PASSED");
    expect(result.errors).toEqual([]);
  });
});