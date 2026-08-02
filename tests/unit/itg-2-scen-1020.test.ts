import { validateProposalAmountRange } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1020
  test("提案内容の金額項目が業務上の最大規模金額を超える場合に値域検証エラーとして拒否される", () => {
    const max_limit_amount = 10000000;
    const proposal_amount = 10000001;

    const result = validateProposalAmountRange({
      proposal_amount: proposal_amount,
      max_limit_amount: max_limit_amount,
    });

    expect(result.validation_status).toBe("REJECTED");
    expect(result.error_code).toBe("VALIDATION_AMOUNT_EXCEEDS_MAX_LIMIT");
    expect(result.error_message).toBe(
      "提案金額が最大規模金額10,000,000円を超えています"
    );
  });
});