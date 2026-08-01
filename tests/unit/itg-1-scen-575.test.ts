import { calculatePriorityScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-575
  test("優先度スコアの計算機能 - 問題の発生日時が欠けている場合、計算が失敗する", () => {
    const inputWithoutOccurrenceTime = {
      problemCategory: "data_quality",
      impactDegree: 85,
      detectionSource: "automated_check",
      occurrenceTime: null,
      frequency: 3,
    };

    expect(() => calculatePriorityScore(inputWithoutOccurrenceTime)).toThrow(
      /発生日時/
    );
  });
});