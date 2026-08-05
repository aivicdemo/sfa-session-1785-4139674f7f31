import { describe, test, expect } from "@jest/globals";
import { validateProblemSeverity } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-834
  test("問題検出結果のレビュー・判定機能 - 重要度が定義された列挙値の範囲外である場合にエラーになること", () => {
    const invalidSeverity = "critical";
    
    expect(() => validateProblemSeverity(invalidSeverity)).toThrow(/重要度/);
  });
});