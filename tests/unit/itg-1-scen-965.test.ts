import { describe, test, expect } from "@jest/globals";
import { normalizeFailureReason } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-965: 成功要因・失敗要因の抽出と承認基準検証 - 抽出された失敗要因が言語化基準を満たすテキストフォーマットで正規化される", () => {
    const inputText = "　顧客対応がおくれた。。顧客満足度が低下します　";
    const expectedOutput =
      "顧客対応が遅れた。顧客満足度が低下する。";

    const result = normalizeFailureReason(inputText);

    expect(result).toBe(expectedOutput);
    expect(result).not.toMatch(/^\s/);
    expect(result).not.toMatch(/\s$/);
    expect(result).not.toMatch(/。。/);
    expect(result).not.toMatch(/ます/);
    expect(result).toMatch(/。$/);
  });
});