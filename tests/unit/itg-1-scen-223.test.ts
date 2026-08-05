import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-223: スコア計算の冪等性検証 - 同一の営業担当者の商談記録で標準プロセス遵守度スコアを2回計算した場合、同じスコアが得られる", () => {
    const sales_rep_id = "EMP001";
    const total_deals = 5;
    const completed_deals = 3;
    const compliant_deals = 4;

    const first_score = calculateProcessComplianceScore({
      sales_rep_id,
      total_deals,
      completed_deals,
      compliant_deals,
    });

    const second_score = calculateProcessComplianceScore({
      sales_rep_id,
      total_deals,
      completed_deals,
      compliant_deals,
    });

    expect(first_score).toBe(0.8);
    expect(second_score).toBe(0.8);
    expect(first_score).toBe(second_score);
  });
});