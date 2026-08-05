import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-760
  test("正解ラベルが null のときエラーになる", () => {
    const inferenceResults = [
      {
        prediction_id: "pred_001",
        predicted_label: "高確度",
        correct_label: "高確度",
      },
      {
        prediction_id: "pred_002",
        predicted_label: "中確度",
        correct_label: "中確度",
      },
    ];

    expect(() => {
      calculateInferenceAccuracyScore({
        inference_results: inferenceResults,
        correct_label: null,
      });
    }).toThrow(/正解ラベル/);
  });
});