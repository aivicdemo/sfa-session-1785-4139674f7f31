import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  it("SCEN-806: [edge] 問題検出結果の重要度・優先度分類機能 - 検出日が月末日の場合、対応期限の計算が正しく月をまたぐ", async () => {
    const { calculateResponseDeadline } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const detection_date = new Date("2024-01-31T10:00:00Z");
    const priority_level = "high";
    const deadline_days = 14;

    const result = calculateResponseDeadline({
      detection_date,
      priority_level,
      deadline_days,
    });

    const expected_deadline = new Date("2024-02-14T10:00:00Z");

    expect(result).toEqual({
      response_deadline: expected_deadline,
      priority_level: "high",
      days_until_deadline: 14,
    });
  });
});