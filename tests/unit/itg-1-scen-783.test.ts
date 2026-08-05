import { describe, test, expect } from "@jest/globals";
import { classifyAndPrioritizeDetectedProblems } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-783: 問題検出結果が空配列の場合、適切なエラーが発生する", () => {
    // 入力: 空配列
    const empty_detection_results: object[] = [];

    // 期待結果: エラーが発生し、エラーメッセージに『検出された問題リストが空です』を含む
    expect(() => classifyAndPrioritizeDetectedProblems(empty_detection_results)).toThrow(
      /検出された問題リストが空/
    );
  });
});