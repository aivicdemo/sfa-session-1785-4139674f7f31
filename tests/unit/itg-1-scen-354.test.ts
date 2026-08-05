import { describe, test, expect, beforeEach } from "@jest/globals";
import { judgeSystemHealthCheckPass } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-354: [edge] システムヘルスチェック合格判定機能 - AIエージェント推論精度がちょうど合格基準値に達した場合に合格と判定される
  test("should judge system health check as pass when AI inference accuracy equals exactly the pass threshold of 75.0%", () => {
    const ai_inference_accuracy_percent = 75.0;
    const pass_threshold_percent = 75.0;

    const result = judgeSystemHealthCheckPass({
      ai_inference_accuracy_percent,
      pass_threshold_percent,
    });

    expect(result).toEqual({
      status: 200,
      is_pass: true,
      ai_inference_accuracy_percent: 75.0,
      pass_threshold_percent: 75.0,
      message: "合格",
    });
  });
});