import { validateInferenceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-485
  test("推論精度スコアが負の値の場合、エラーを返す", () => {
    const invalid_score = -0.5;

    expect(() => validateInferenceScore(invalid_score)).toThrow(
      /推論精度スコア/
    );
  });
});