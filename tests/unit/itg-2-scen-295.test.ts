import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス標準書の策定と運用 / 営業プロセス遵守状況をモニタリング・改善", () => {
  test("SCEN-295: 標準プロセス遵守度スコア計算 - 全4ステップが標準プロセスから大きく乖離するとき、総スコアが最低点になる", () => {
    const input = {
      stepA_compliance_score: 0,
      stepB_compliance_score: 0,
      stepC_compliance_score: 0,
      stepD_compliance_score: 0,
      stepA_deviation_rate: 1.0,
      stepB_deviation_rate: 1.0,
      stepC_deviation_rate: 1.0,
      stepD_deviation_rate: 1.0,
    };

    const result = calculateProcessComplianceScore(input);

    expect(result.total_compliance_score).toBe(0);
  });
});