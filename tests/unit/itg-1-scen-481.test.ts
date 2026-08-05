import { describe, test, expect, beforeEach } from "@jest/globals";
import { validateAiInferenceLogExists } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-481
  test("AIエージェント推論ログが欠落している場合、エラーを返す", () => {
    const missingLogInput = null;

    const executeValidation = () => {
      validateAiInferenceLogExists(missingLogInput);
    };

    expect(executeValidation).toThrow(/推論ログ/);
  });
});