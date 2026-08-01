import { describe, it as test, expect, beforeEach } from "@jest/globals";
import { evaluateSystemHealth } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-221
  test("[normal] システムヘルスチェック判定機能 - AIエージェント推論精度が合格基準を下回るとき不合格判定が出力される", () => {
    const ai_inference_accuracy_percent = 78;
    const passing_threshold_percent = 85;

    const result = evaluateSystemHealth({
      ai_inference_accuracy_percent,
      passing_threshold_percent,
    });

    expect(result.status).toBe("不合格");
    expect(result.reason).toContain("AIエージェント推論精度が78%");
    expect(result.reason).toContain("合格基準85%以下のため");
  });
});