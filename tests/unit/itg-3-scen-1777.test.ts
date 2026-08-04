import { classifyDisplayPriority } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1777
  test("根拠表示優先度が0.51のとき根拠表示順序を高として分類する", () => {
    const reasoningScore = 0.51;
    const result = classifyDisplayPriority(reasoningScore);

    expect(result).toBe("HIGH");
  });
});