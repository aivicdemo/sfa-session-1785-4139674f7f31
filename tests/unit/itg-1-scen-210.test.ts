import { calculateContractRate } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-210: 成約金額が0円の場合、ゼロ除算を回避して成約率0%を返す", () => {
    const sales_rep_id = "SR001";
    const contract_count = 5;
    const contract_amount = 0;

    const result = calculateContractRate({
      sales_rep_id,
      contract_count,
      contract_amount,
    });

    expect(result.contract_rate).toBe(0.0);
    expect(result.has_error).toBe(false);
  });
});