import { validateProposalFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1027
  test("提案内容の提案日付が不正な日付形式である場合に形式検証エラーとして拒否される", () => {
    const proposal = {
      proposalId: "PROP-001",
      customerId: "CUST-001",
      proposalDate: "2024-13-45",
      proposalContent: "Sample proposal",
      amount: 100000,
    };

    const result = validateProposalFormat(proposal);

    expect(result.status).toBe("VALIDATION_ERROR");
    expect(result.errorCode).toBe("INVALID_DATE_FORMAT");
    expect(result.errorMessage).toBe(
      "提案日付の形式が不正です。形式: YYYY-MM-DD"
    );
    expect(result.isValid).toBe(false);
    expect(result.invalidFields).toContain("proposalDate");
  });
});