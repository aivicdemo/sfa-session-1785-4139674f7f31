import { decidePriorityForImprovement } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2897: 改善対象件数がちょうど1件のときに優先度が中と設定される", () => {
    const improvementTargetCount = 1;

    const result = decidePriorityForImprovement({
      improvementTargetCount,
    });

    expect(result.priority).toBe("中");
  });
});