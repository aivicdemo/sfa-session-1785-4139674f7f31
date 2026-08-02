import { calculateScaleCompatibilityScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-708
  test("提案資料と顧客ニーズの適合度スコア化機能 - 顧客規模が完全に異なるとき、規模適合スコアが最低値になる", () => {
    const customer_scale = "large_enterprise";
    const proposal_target_scale = "startup";

    const score = calculateScaleCompatibilityScore({
      customer_scale,
      proposal_target_scale,
    });

    expect(score).toBe(0);
  });
});