import { calculateClosureRate } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 営業プロセス実行状況分析", () => {
  test("SCEN-838: 成約件数が総商談件数と等しいとき、成約率は100%で返される", () => {
    const closed_deals = 50;
    const total_deals = 50;

    const result = calculateClosureRate({
      closed_deals,
      total_deals,
    });

    expect(result).toBe(100);
  });
});