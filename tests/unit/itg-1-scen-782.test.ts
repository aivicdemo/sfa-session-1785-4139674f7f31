import { classifyDetectionResultsByPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-782
  test("問題検出結果の重要度・優先度分類機能 - 高重要度かつ高優先度の問題が複数件ある場合、すべてが対応対象として即座対応リストに含まれる", () => {
    const detectionResults = [
      {
        problemId: "P001",
        severity: "high",
        priority: "high",
        description: "プロセス逸脱の重大な乖離",
      },
      {
        problemId: "P002",
        severity: "high",
        priority: "high",
        description: "提案内容の大幅な不適切パターン",
      },
      {
        problemId: "P003",
        severity: "medium",
        priority: "low",
        description: "軽微なデータ入力漏落",
      },
    ];

    const result = classifyDetectionResultsByPriority(detectionResults);

    expect(result.immediateActionList).toHaveLength(2);
    expect(result.immediateActionList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          problemId: "P001",
          severity: "high",
          priority: "high",
        }),
        expect.objectContaining({
          problemId: "P002",
          severity: "high",
          priority: "high",
        }),
      ])
    );
    expect(
      result.immediateActionList.some((item) => item.problemId === "P003")
    ).toBe(false);
  });
});