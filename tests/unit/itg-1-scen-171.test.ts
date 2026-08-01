import { analyzeAndJudge } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-171
  test("成約実績が0件の場合、相関分析が実行されず判定結果にNULLが設定される", async () => {
    const userId = "TEST_USER_001";
    const salesPersonId = "TEST_USER_001";
    const closedDealsCount = 0;

    const input = {
      salesPersonId: salesPersonId,
      closedDealsCount: closedDealsCount,
    };

    const result = await analyzeAndJudge(input);

    expect(result.correlationAnalysis).toBeNull();
    expect(result.improvementTargetFlag).toBeNull();
  });
});