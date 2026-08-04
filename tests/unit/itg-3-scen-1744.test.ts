import { classifyReasonPriority } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1744
  test("根拠ウェイトが0.49のとき根拠優先度を低として分類する", () => {
    const weight = 0.49;
    const result = classifyReasonPriority(weight);
    expect(result).toBe("low");
  });
});