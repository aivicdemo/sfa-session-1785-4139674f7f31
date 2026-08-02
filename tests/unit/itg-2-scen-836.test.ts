import { describe, test, expect } from "@jest/globals";
import { calculateContractRate } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  // SCEN-836
  test("成約件数が0件で総商談件数が1件以上のとき、成約率は0で返される", () => {
    const result = calculateContractRate({
      completedContractCount: 0,
      totalDealCount: 5,
    });

    expect(result).toBe(0);
    expect(typeof result).toBe("number");
  });
});